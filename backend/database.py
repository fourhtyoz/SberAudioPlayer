# app/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "postgresql+asyncpg://postgres:123456@localhost/postgres"
DATABASE_URL = "postgresql+asyncpg://postgres:123456@db/postgres"

engine = create_async_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, 
                            class_=AsyncSession, 
                            expire_on_commit=False,
                            autocommit=False, 
                            autoflush=False)
Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session
