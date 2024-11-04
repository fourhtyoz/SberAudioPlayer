import os
import redis
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
                         create_access_token, decode_access_token, \
                         get_current_user
from backend.player_service_stub import play_audio, stop_audio

from pydantic import BaseModel
from datetime import datetime, timezone
from typing import List


redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

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
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": data.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post('/logout')
async def logout(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    expire = payload.get("exp")
    if not expire:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload")

    remaining_time = expire - int(datetime.now(timezone.utc).timestamp())
    redis_client.setex(f"blacklist:{token}", remaining_time, "blacklisted")

    return {"message": "Successfully logged out"}


@app.get("/protected/")
async def protected_route(token: str = Depends(oauth2_scheme)):
    token = decode_access_token(token)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is invalid or expired")

    return {"message": "You have access to this protected route"}


@app.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    # Save the file in chunks asynchronously
    try:
        with open(file_location, "wb") as f:
            while chunk := await file.read(CHUNK_SIZE):
                f.write(chunk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    # Forward the file to the player service
    async with httpx.AsyncClient() as client:
        with open(file_location, "rb") as f:
            files = {"file": (file.filename, f, file.content_type or "audio/mpeg")}
            try:
                response = await client.post(f'{PLAYER_SERVICE_URL}/add-audio/', files=files)
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise HTTPException(status_code=response.status_code, detail="Failed to send audio to queue")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error in forwarding file: {e}")

    return {"message": "File uploaded and forwarded successfully"}


@app.websocket("/ws/queue/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    async with httpx.AsyncClient() as client:
        try:
            while True:
                try:
                    # Asynchronously get the current queue from the player service
                    response = await client.get(f'{PLAYER_SERVICE_URL}/get_current_queue/')
                    response.raise_for_status()
                    data = response.json()
                except httpx.HTTPStatusError as e:
                    print(f"HTTP error occurred: {e}")
                    data = {"error": "Failed to retrieve queue data"}
                except httpx.RequestError as e:
                    print(f"Request error: {e}")
                    data = {"error": "Connection to player service failed"}

                # Send the queue data to the client
                await websocket.send_json(data)

                await asyncio.sleep(1)
        except WebSocketDisconnect:
            print("WebSocket disconnected")
        except Exception as e:
           print(f"Unexpected error: {e}")


@app.post("/play-audio/")
async def start_playing_audio(audio: AudioRequest):
    success = play_audio(audio.audio_id, audio.url)
    if success:
        return {"status": "Playing audio"}
    else:
        return {"error": "Failed to start audio playback"}


@app.post("/stop-audio/")
async def stop_playing_audio():
    success = stop_audio()
    if success:
        return {"status": "Audio stopped"}
    else:
        return {"error": "Failed to stop audio playback"}
