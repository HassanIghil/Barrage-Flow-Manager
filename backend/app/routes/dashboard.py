from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db

router = APIRouter()

# 🔹 GET /api/dashboard/overview
@router.get("/api/dashboard/overview")
def get_dashboard_overview(db: Session = Depends(get_db)):
    
    result = db.execute(text("CALL sp_dashboard_stats()"))

    data = []
    for row in result:
        data.append({
            "barrage": row.barrage,
            "niveau_eau_m3": float(row.niveau_eau_m3),
            "capacite_max_m3": float(row.capacite_max_m3),
            "pourcentage_remplissage": float(row.pourcentage_remplissage),
            "nb_alertes_critiques": row.nb_alertes_critiques,
            "nb_demandes_en_attente": row.nb_demandes_en_attente
        })

    return data


# 🔹 GET /api/dashboard/history
@router.get("/api/dashboard/history")
def get_dashboard_history(db: Session = Depends(get_db)):

    result = db.execute(text("SELECT * FROM v_historique_lachers"))

    data = []
    for row in result:
        data.append({
            "date_lacher": str(row.date_lacher),
            "volume_m3": float(row.volume_m3),
            "type": row.type,
            "status": row.status,
            "motif": row.motif,
            "utilisateur": row.nom_utilisateur,
            "barrage": row.nom_barrage
        })

    return data