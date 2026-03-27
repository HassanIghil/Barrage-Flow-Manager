from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional
from enum import Enum

# OWASP A01 : Empêcher l'injection de rôles inventés
class RoleEnum(str, Enum):
    directeur = "directeur"
    ingenieur = "ingenieur"
    operateur = "operateur"

class UserBase(BaseModel):
    nom: str = Field(..., min_length=2, max_length=100)
    prenom: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: RoleEnum

class UserCreate(UserBase):
    # OWASP A02 : Forcer un mot de passe d'au moins 8 caractères
    password: str = Field(..., min_length=8)

class UserRead(UserBase):
    id_user: int
    date_creation: date

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
