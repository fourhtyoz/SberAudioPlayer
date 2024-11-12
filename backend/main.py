import os
import asyncio
import httpx

from fastapi import FastAPI, Depends, HTTPException, status, \
                    WebSocket, WebSocketDisconnect, \
                    File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import Base, engine, get_db
from models import User, UserData
from auth import get_password_hash, verify_password, \
                 create_access_token, decode_access_token
from contextlib import asynccontextmanager


# Constants
OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="token")
PLAYER_SERVICE_URL = 'http://player:8001'
CHUNK_SIZE = 1024 * 1024  # 1 MB
UPLOAD_DIR = '/tmp/uploads'
os.makedirs(UPLOAD_DIR, exist_ok=True)


@asynccontextmanager
async def lifespan(app):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
                    "http://localhost:3000",
                    "http://frontend:3000", 
                    "http://0.0.0.0:3000", 
                    "http://127.0.0.1:3000",
                    "http://player:8001", 
                    "http://localhost:8001",
                    "http://0.0.0.0:8001", 
                    "http://127.0.0.1:8001",
                    "http://sounds:50051", 
                    "http://localhost:50051",
                    "http://0.0.0.0:50051", 
                    "http://127.0.0.1:50051",
                ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
@app.post("/register/")
async def register(data: UserData, db: AsyncSession = Depends(get_db)):
    
    # Проверка БД на наличие юзера
    existing_user = await db.execute(select(User).where(User.username == data.username))
    if existing_user.scalar() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким именем уже существует")

    # Создание нового юзера
    if len(data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пароль должен быть минимум 6 символов")
    
    if len(data.username) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Логин должен быть минимум 3 символа")
    
    user = User(username=data.username, hashed_password=get_password_hash(data.password))
    db.add(user)
    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Произошла ошибка при создании юзера: {e}")

    return {"message": "Успешная регистрация"}


@app.post("/login/")
async def login(data: UserData, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalars().first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неправильные учетные данные")

    access_token = create_access_token(data={"username": data.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/upload-audio/")
async def upload_audio(token: str = Depends(OAUTH2_SCHEME), file: UploadFile = File(...)):
    user = decode_access_token(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный или просроченный токен")

    file_location = os.path.join(UPLOAD_DIR, file.filename)

    try:
        with open(file_location, "wb") as f:
            while chunk := await file.read(CHUNK_SIZE):
                f.write(chunk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Не удалось сохранить файл: {e}")

    async with httpx.AsyncClient() as client:
        with open(file_location, "rb") as f:
            files = {"file": (file.filename, f, file.content_type or "audio/mpeg")}
            data = {
                "user": user.get('username')
            }
            try:
                response = await client.post(f'{PLAYER_SERVICE_URL}/add-audio/', files=files, data=data)
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise HTTPException(status_code=response.status_code, detail="Не удалось отправить файл в очередь")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Ошибка при отправке запроса в player_service: {e}")

    return {"message": "Файл был успешно добавлен в очередь"}


@app.post("/delete-audio/")
async def delete_audio(index: str, token: str = Depends(OAUTH2_SCHEME)):
    token = decode_access_token(token)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный или просроченный токен")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f'{PLAYER_SERVICE_URL}/delete-audio/?index={index}')
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail="Не удалось удалить файл из очереди")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка при отправке запроса в player_service: {e}")

    return {'message': 'Файл был успешно удален'}


@app.get('/play-audio/')
async def play_audio(filename: str, token: str = Depends(OAUTH2_SCHEME)):
    token = decode_access_token(token)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный или просроченный токен")

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.get(f'{PLAYER_SERVICE_URL}/play-audio/?filename={filename}')
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail="Не удалось воспроизвести файл")
        except Exception as e:
                raise HTTPException(status_code=500, detail=f"Ошибка при воспроизведении файла: {e}")
    
    return {"message": "Конец воспроизведения"}


@app.websocket("/ws/queue/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    async with httpx.AsyncClient() as client:
        try:
            while True:
                try:
                    response = await client.get(f'{PLAYER_SERVICE_URL}/get_current_queue/')
                    response.raise_for_status()
                    data = response.json()
                except httpx.HTTPStatusError as e:
                    print(f"HTTP error occurred: {e}")
                    data = {"error": "Не удалось забрать текущую очередь из player_service"}
                except httpx.RequestError as e:
                    print(f"Request error: {e}")
                    data = {"error": "Не удалось подключиться к player_service"}

                await websocket.send_json(data)
                await asyncio.sleep(1)
                
        except WebSocketDisconnect:
            print("WebSocket disconnected")
        except Exception as e:
           print(f"Unexpected error: {e}")
