from pydantic import BaseModel
from typing import List
from datetime import date

class DashboardSummary(BaseModel):
    total_volume_lache_m3: float
    nb_alertes_critiques: int
    nb_demandes_en_attente: int

class DashboardResponse(BaseModel):
    date_jour: date
    summary: DashboardSummary
    # On pourra ajouter plus de détails ici plus tard
