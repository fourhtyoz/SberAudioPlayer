import redis
from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import SessionLocal, Base, engine
from backend.models import Base, User
from backend.auth import get_password_hash, verify_password, \
    create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
TOKEN_EXPIRATION_MINUTES = 30

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store connected WebSocket clients
clients: List[WebSocket] = []

async def get_db():
    async with SessionLocal() as session:
        yield session

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

class UserData(BaseModel):
    username: str
    password: str

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
@app.post('/logout')
async def logout(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # Get the token's expiration and calculate remaining time
    expire = payload.get("exp")
    if not expire:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload")

    remaining_time = expire - int(datetime.utcnow().timestamp())
    redis_client.setex(f"blacklist:{token}", remaining_time, "blacklisted")

    return {"message": "Successfully logged out"}

# Dependency to check if a token is blacklisted
async def is_blacklisted(token: str):
    if redis_client.get(f"blacklist:{token}") is not None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked")

@app.get("/protected/")
async def protected_route(token: str = Depends(oauth2_scheme)):
    token = decode_access_token(token)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is invalid or expired")

    return {"message": "You have access to this protected route"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()  # Accept the WebSocket connection
    clients.append(websocket)  # Add the client to the list

    print('websocket', websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print('data', data)  # Receive data from client
            # Broadcast the received message to all connected clients
            for client in clients:
                await client.send_text(f"Message from server: {data}")
    except WebSocketDisconnect:
        clients.remove(websocket)  # Remove client if they disconnect

# @app.get("/items/")
# async def read_items(db: AsyncSession = Depends(get_db)):
#     items = await crud.get_items(db)
#     return items
