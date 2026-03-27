from sqlalchemy import Column, Integer, String, Float, Date, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class Barrage(Base):
    __tablename__ = "barrage"

    id_barrage = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(100), nullable=False)
    localisation = Column(String(255), nullable=False)
    capacite_max_m3 = Column(Float, nullable=False)
    niveau_eau_m3 = Column(Float, nullable=False)
    seuil_securite_m3 = Column(Float, nullable=False)
    date_mise_service = Column(Date, nullable=False)

    __table_args__ = (
        CheckConstraint("niveau_eau_m3 >= 0", name="check_niveau_eau"),
        CheckConstraint("seuil_securite_m3 > 0", name="check_seuil_securite"),
        CheckConstraint("capacite_max_m3 > seuil_securite_m3", name="check_capacite_seuil"),
    )

    # Relationships
    lachers = relationship("LacherEau", back_populates="barrage")
    alertes = relationship("Alerte", back_populates="barrage")
