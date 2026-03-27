from sqlalchemy import Column, Integer, String, Float, Boolean, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Cooperative(Base):
    __tablename__ = "cooperative"

    id_coop = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(100), nullable=False)
    surface_hectares = Column(Float, nullable=False)
    localisation_gps = Column(String(100), nullable=True)
    contact_email = Column(String(255), nullable=True)
    actif = Column(Boolean, nullable=False, server_default=text("1"))

    # Relationships
    repartitions = relationship("Repartition", back_populates="cooperative")
    demandes = relationship("DemandeIrrigation", back_populates="cooperative")
