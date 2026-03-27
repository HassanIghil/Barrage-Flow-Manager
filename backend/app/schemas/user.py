from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional

class UserBase(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id_user: int
    date_creation: date

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
