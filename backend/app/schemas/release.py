from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional

class ReleaseBase(BaseModel):
    volume_m3: float = Field(..., gt=0)
    type: str = "normal"
    # OWASP A03 : Limiter la taille du texte pour éviter les injections massives
    motif: Optional[str] = Field(None, max_length=500)
    id_barrage: int

class ReleaseRequest(ReleaseBase):
    @field_validator('volume_m3')
    @classmethod
    def volume_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError('Le volume doit être strictement supérieur à 0')
        return v

class ReleaseRead(ReleaseBase):
    id_lacher: int
    date_lacher: date
    status: str
    id_user: int

    class Config:
        from_attributes = True
