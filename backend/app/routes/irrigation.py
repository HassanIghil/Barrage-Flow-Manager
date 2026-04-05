from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.core.database import get_db
from app.models.demande_irrigation import DemandeIrrigation
from app.models.cooperative import Cooperative
from app.schemas.irrigation import IrrigationCreate, IrrigationRead, IrrigationUpdate, IrrigationStatus
from app.middleware.rbac import role_checker

router = APIRouter(
    prefix="/api/irrigation",
    tags=["Irrigation"]
)

# 🔹 GET /api/irrigation/
# Lister toutes les demandes (Ingénieurs et Directeurs)
@router.get("/", response_model=List[IrrigationRead])
def get_demandes(
    payload: dict = Depends(role_checker(["directeur", "ingenieur", "operateur"])),
    db: Session = Depends(get_db)
):
    # On fait un JOIN pour avoir le nom de la coopérative directement
    result = db.query(
        DemandeIrrigation.id_demande,
        DemandeIrrigation.volume_demande_m3,
        DemandeIrrigation.date_demande,
        DemandeIrrigation.status,
        DemandeIrrigation.priorite,
        DemandeIrrigation.id_coop,
        DemandeIrrigation.id_user,
        Cooperative.nom.label("nom_coop")
    ).join(Cooperative).all()
    
    return result

# 🔹 POST /api/irrigation/
# Créer une nouvelle demande
@router.post("/", status_code=201, response_model=IrrigationRead)
def create_demande(
    demande_data: IrrigationCreate,
    payload: dict = Depends(role_checker(["directeur", "ingenieur", "operateur"])),
    db: Session = Depends(get_db)
):
    # Vérifier si la coopérative existe et est active
    coop = db.query(Cooperative).filter(Cooperative.id_coop == demande_data.id_coop).first()
    if not coop:
        raise HTTPException(status_code=404, detail="Coopérative non trouvée")
    if not coop.actif:
        raise HTTPException(status_code=400, detail="La coopérative est inactive")

    nouvelle_demande = DemandeIrrigation(
        volume_demande_m3=demande_data.volume_demande_m3,
        priorite=demande_data.priorite,
        id_coop=demande_data.id_coop,
        status="en_attente",
        date_demande=date.today()
    )
    
    db.add(nouvelle_demande)
    db.commit()
    db.refresh(nouvelle_demande)
    return nouvelle_demande

# 🔹 PUT /api/irrigation/{id_demande}/status
# Approuver ou Refuser une demande (RÉSERVÉ AU DIRECTEUR)
@router.put("/{id_demande}/status", response_model=IrrigationRead)
def update_demande_status(
    id_demande: int,
    status_update: IrrigationUpdate,
    payload: dict = Depends(role_checker(["directeur"])), # Seul le directeur décide
    db: Session = Depends(get_db)
):
    demande = db.query(DemandeIrrigation).filter(DemandeIrrigation.id_demande == id_demande).first()
    if not demande:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    
    # On met à jour le statut et on lie l'ID du directeur qui a validé
    demande.status = status_update.status
    demande.id_user = payload["id"] # L'ID contenu dans le JWT (Hassan, etc.)
    
    db.commit()
    db.refresh(demande)
    return demande
