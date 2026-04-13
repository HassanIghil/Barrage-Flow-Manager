from pydantic import BaseModel, Field
from datetime import date
from typing import Optional
from enum import Enum

class IrrigationStatus(str, Enum):
    EN_ATTENTE = "en_attente"
    APPROUVE = "approuve"
    REFUSE = "refuse"

class IrrigationBase(BaseModel):
    volume_demande_m3: float = Field(..., gt=0)
    priorite: int = Field(3, ge=1, le=5) # 1 (basse) à 5 (critique)
    id_coop: int = Field(..., gt=0)

class IrrigationCreate(IrrigationBase):
    pass

class IrrigationUpdate(BaseModel):
    status: IrrigationStatus

class IrrigationRead(IrrigationBase):
    id_demande: int
    date_demande: date
    status: IrrigationStatus
    id_user: Optional[int] = None
    nom_coop: Optional[str] = None # Utile pour l'affichage frontend

    class Config:
        from_attributes = True
