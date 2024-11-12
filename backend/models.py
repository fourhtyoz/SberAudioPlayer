# app/models.py
from sqlalchemy import Column, Integer, String
from database import Base
from pydantic import BaseModel


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class UserData(BaseModel):
    username: str
    password: str