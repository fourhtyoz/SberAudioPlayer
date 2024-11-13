import os
from sqlalchemy import Column, Integer, String
from pydantic import BaseModel

GITHUB_CICD = os.getenv('GITHUB_CICD')
ENV_LOCAL = os.getenv('ENV_LOCAL')
if GITHUB_CICD or ENV_LOCAL:
    from backend.database import Base
else:
    from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class UserData(BaseModel):
    username: str
    password: str