from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.middleware.rbac import role_checker

router = APIRouter()

# 🔹 GET /api/alerts/recent
@router.get("/api/alerts/recent")
def get_recent_alerts(
    payload: dict = Depends(role_checker(["directeur", "ingenieur", "operateur"])),
    db: Session = Depends(get_db)
):

    result = db.execute(text("""
        SELECT *
        FROM alerte
        WHERE type = 'critique'
        ORDER BY date_creation DESC
        LIMIT 10
    """))

    data = []
    for row in result:
        data.append({
            "id_alerte": row.id_alerte,
            "type": row.type,
            "message": row.message,
            "date_creation": str(row.date_creation)
        })

    return data