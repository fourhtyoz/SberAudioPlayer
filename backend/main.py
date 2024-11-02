# app/main.py
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .database import SessionLocal, Base, engine
from . import crud

app = FastAPI()

async def get_db():
    async with SessionLocal() as session:
        yield session

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/items/")
async def read_items(db: AsyncSession = Depends(get_db)):
    items = await crud.get_items(db)
    return items
