from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, CheckConstraint, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class DemandeIrrigation(Base):
    __tablename__ = "demande_irrigation"

    id_demande = Column(Integer, primary_key=True, index=True, autoincrement=True)
    volume_demande_m3 = Column(Float, nullable=False)
    date_demande = Column(Date, nullable=False, server_default=text("(CURRENT_DATE)"))
    status = Column(String(20), nullable=False, server_default=text("'en_attente'"))
    priorite = Column(Integer, server_default=text("1"))
    id_coop = Column(Integer, ForeignKey("cooperative.id_coop"), nullable=False)
    id_user = Column(Integer, ForeignKey("utilisateur.id_user"), nullable=True)

    __table_args__ = (
        CheckConstraint("volume_demande_m3 > 0", name="check_volume_demande"),
        CheckConstraint("status IN ('en_attente', 'approuve', 'refuse')", name="check_status_demande"),
        CheckConstraint("priorite BETWEEN 1 AND 5", name="check_priorite_demande"),
    )

    # Relationships
    cooperative = relationship("Cooperative", back_populates="demandes")
    user = relationship("User", back_populates="demandes_traitees")
