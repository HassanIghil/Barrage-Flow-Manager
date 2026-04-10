from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.middleware.rbac import role_checker

router = APIRouter()

# 🔹 GET /api/alerts
@router.get("/api/alerts")
def get_alerts(
    payload: dict = Depends(role_checker(["directeur", "ingenieur", "operateur"])),
    db: Session = Depends(get_db)
):

    result = db.execute(text("""
        SELECT a.id_alerte, a.type, a.message, a.date_creation, b.nom as barrage_nom
        FROM alerte a
        JOIN barrage b ON a.id_barrage = b.id_barrage
        ORDER BY a.date_creation DESC
    """))

    data = []
    for row in result:
        data.append({
            "id": row.id_alerte,
            "severity": row.type,  # 'critique', 'warning', 'info'
            "title": f"Alerte de sécurité - {row.barrage_nom}",
            "description": row.message,
            "time": str(row.date_creation),
            "statusLabel": "Enregistré",
            "action": "Détails"
        })

    return data