from pydantic import BaseModel, Field, EmailStr
from typing import Optional

# --- COOPERATIVES ---
class CooperativeBase(BaseModel):
    nom: str = Field(..., min_length=2, max_length=100)
    surface_hectares: float = Field(..., gt=0)
    localisation_gps: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    actif: bool = True

class CooperativeCreate(CooperativeBase):
    pass

class CooperativeUpdate(BaseModel):
    nom: Optional[str] = None
    surface_hectares: Optional[float] = None
    localisation_gps: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    actif: Optional[bool] = None

class CooperativeRead(CooperativeBase):
    id_coop: int
    class Config:
        from_attributes = True

# --- BARRAGE ---
class BarrageUpdate(BaseModel):
    nom: Optional[str] = None
    localisation: Optional[str] = None
    capacite_max_m3: Optional[float] = None
    seuil_securite_m3: Optional[float] = None

class BarrageRead(BaseModel):
    id_barrage: int
    nom: str
    localisation: str
    capacite_max_m3: float
    niveau_eau_m3: float
    seuil_securite_m3: float
    date_mise_service: Optional[str] = None
    
    class Config:
        from_attributes = True
