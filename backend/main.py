import os
import asyncio
import httpx

from fastapi import FastAPI, Depends, HTTPException, status, \
                    WebSocket, WebSocketDisconnect, \
                    File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.database import SessionLocal, Base, engine
from backend.models import User
from backend.auth import get_password_hash, verify_password, \
                         create_access_token, decode_access_token

from pydantic import BaseModel
from typing import List


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clients: List[WebSocket] = []


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

CHUNK_SIZE = 1024 * 1024  # 1 MB
PLAYER_SERVICE_URL = "http://localhost:8001"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class UserData(BaseModel):
    username: str
    password: str

class AudioRequest(BaseModel):
    audio_id: str
    url: str


async def get_db():
    async with SessionLocal() as session:
        yield session

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Routes
@app.post("/register/")
async def register(data: UserData, db: AsyncSession = Depends(get_db)):
    user = User(username=data.username, hashed_password=get_password_hash(data.password))
    db.add(user)
    await db.commit()
    return {"message": "User registered successfully"}


@app.post("/login/")
async def login(data: UserData, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalars().first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неправильные учетные данные")

    access_token = create_access_token(data={"username": data.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/upload-audio/")
async def upload_audio(token: str = Depends(oauth2_scheme), file: UploadFile = File(...)):
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
async def delete_audio(index: str, token: str = Depends(oauth2_scheme)):
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


# @app.get('/play-queue/')
# async def play_queue():
#     async with httpx.AsyncClient(timeout=60.0) as client:
#         try:
#             response = await client.get(f'{PLAYER_SERVICE_URL}/play-queue/')
#             response.raise_for_status()
#         except httpx.HTTPStatusError as e:
#             raise HTTPException(status_code=response.status_code, detail="Failed to play the queue")
#         except Exception as e:
#                 raise HTTPException(status_code=500, detail=f"Error in playing the file: {e}")
#     return {"message": "Finished"}


@app.get('/play-audio/')
async def play_audio(filename: str, token: str = Depends(oauth2_scheme)):
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
