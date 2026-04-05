from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class WaterLevelPoint(BaseModel):
    date: str
    volume_m3: float

class DashboardSummary(BaseModel):
    total_volume_lache_m3: float
    nb_alertes_critiques: int
    nb_demandes_en_attente: int

class DashboardResponse(BaseModel):
    date_jour: date
    summary: DashboardSummary
    level_history: List[WaterLevelPoint] # Données pour le Graphique LineChart
    distribution_coops: Optional[List[dict]] = None # Pour un PieChart (répartitions)

    class Config:
        from_attributes = True
