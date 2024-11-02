# app/crud.py
from sqlalchemy.ext.asyncio import AsyncSession
from . import models

async def get_items(db: AsyncSession):
    return await db.execute("SELECT * FROM items").all()
