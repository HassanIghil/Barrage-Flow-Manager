from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.cooperative import Cooperative
from app.models.barrage import Barrage
from app.schemas.management import CooperativeCreate, CooperativeUpdate, CooperativeRead, BarrageUpdate, BarrageRead
from app.middleware.rbac import role_checker

router = APIRouter(
    prefix="/api/admin/management",
    tags=["Administration et Gestion Base"]
)

# --- ROUTES COOPERATIVES ---

@router.get("/cooperatives", response_model=List[CooperativeRead])
def get_cooperatives(
    payload: dict = Depends(role_checker(["directeur", "ingenieur", "operateur"])),
    db: Session = Depends(get_db)
):
    return db.query(Cooperative).all()

@router.post("/cooperatives", response_model=CooperativeRead, status_code=201)
def create_cooperative(
    coop_data: CooperativeCreate,
    payload: dict = Depends(role_checker(["directeur"])), # Seul le directeur ajoute
    db: Session = Depends(get_db)
):
    new_coop = Cooperative(**coop_data.model_dump())
    db.add(new_coop)
    db.commit()
    db.refresh(new_coop)
    return new_coop

@router.put("/cooperatives/{id_coop}", response_model=CooperativeRead)
def update_cooperative(
    id_coop: int,
    coop_update: CooperativeUpdate,
    payload: dict = Depends(role_checker(["directeur"])),
    db: Session = Depends(get_db)
):
    coop = db.query(Cooperative).filter(Cooperative.id_coop == id_coop).first()
    if not coop:
        raise HTTPException(status_code=404, detail="Coopérative non trouvée")
    
    # Partial Update
    for key, value in coop_update.model_dump(exclude_unset=True).items():
        setattr(coop, key, value)
    
    db.commit()
    db.refresh(coop)
    return coop

# --- ROUTES BARRAGE ---

@router.get("/barrages", response_model=List[BarrageRead])
def get_barrages(
    payload: dict = Depends(role_checker(["directeur", "ingenieur", "operateur"])),
    db: Session = Depends(get_db)
):
    return db.query(Barrage).all()

@router.put("/barrages/{id_barrage}", response_model=BarrageRead)
def update_barrage(
    id_barrage: int,
    barrage_update: BarrageUpdate,
    payload: dict = Depends(role_checker(["directeur"])),
    db: Session = Depends(get_db)
):
    barrage = db.query(Barrage).filter(Barrage.id_barrage == id_barrage).first()
    if not barrage:
        raise HTTPException(status_code=404, detail="Barrage non trouvé")
    
    # Partial Update
    for key, value in barrage_update.model_dump(exclude_unset=True).items():
        setattr(barrage, key, value)
    
    db.commit()
    db.refresh(barrage)
    return barrage
