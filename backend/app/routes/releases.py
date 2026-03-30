from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.models.lacher_eau import LacherEau
from app.middleware.rbac import role_checker
from pydantic import BaseModel
from datetime import date

router = APIRouter(
    prefix="/api/releases",
    tags=["Releases"]
)

# --------------------------
# Schemas Pydantic
# --------------------------
class LacherCreate(BaseModel):
    volume_m3: float
    type: str = "normal"
    motif: str | None = None
    id_barrage: int

# --------------------------
# Route POST /api/releases
# --------------------------
@router.post("/", status_code=201)
def create_lacher(
    lacher_data: LacherCreate,
    payload: dict = Depends(role_checker(["Ingénieur", "Directeur"])),
    db: Session = Depends(get_db)
):
    """
    Demande de lâcher d'eau.
    Protégée par JWT (Ingénieur ou Directeur)
    """
    # Créer l'objet LacherEau
    nouveau_lacher = LacherEau(
        volume_m3=lacher_data.volume_m3,
        type=lacher_data.type,
        motif=lacher_data.motif,
        status="en_attente",
        date_lacher=date.today(),
        id_user=payload["id_user"],
        id_barrage=lacher_data.id_barrage
    )

    db.add(nouveau_lacher)
    db.commit()
    db.refresh(nouveau_lacher)

    return {"message": "Demande de lâcher créée", "id_lacher": nouveau_lacher.id_lacher}


# --------------------------
# Route PUT /api/releases/{id_lacher}/execute
# --------------------------
@router.put("/{id_lacher}/execute")
def execute_lacher(
    id_lacher: int,
    payload: dict = Depends(role_checker(["Directeur"])),
    db: Session = Depends(get_db)
):
    """
    Exécuter un lâcher d'eau.
    Strictement réservé au Directeur.
    """
    # Récupérer le lacher
    lacher = db.query(LacherEau).filter(LacherEau.id_lacher == id_lacher).first()
    if not lacher:
        raise HTTPException(status_code=404, detail="Lâcher non trouvé")

    # Vérifier le statut
    if lacher.status == "execute":
        raise HTTPException(status_code=400, detail="Lâcher déjà exécuté")

    # Mettre à jour le statut
    lacher.status = "execute"
    db.commit()

    # Appeler la procédure stockée pour répartir l'eau
    try:
        db.execute(text("CALL sp_repartir_eau(:id_lacher)"), {"id_lacher": id_lacher})
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'exécution du lâcher : {str(e)}")

    return {"message": f"Lâcher {id_lacher} exécuté avec succès"}