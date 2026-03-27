from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, Date, CheckConstraint, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class LacherEau(Base):
    __tablename__ = "lacher_eau"

    id_lacher = Column(Integer, primary_key=True, index=True, autoincrement=True)
    volume_m3 = Column(Float, nullable=False)
    date_lacher = Column(Date, nullable=False, server_default=text("(CURRENT_DATE)"))
    type = Column(String(20), nullable=False, server_default=text("'normal'"))
    status = Column(String(20), nullable=False, server_default=text("'en_attente'"))
    motif = Column(Text, nullable=True)
    id_user = Column(Integer, ForeignKey("utilisateur.id_user"), nullable=False)
    id_barrage = Column(Integer, ForeignKey("barrage.id_barrage"), nullable=False)

    __table_args__ = (
        CheckConstraint("volume_m3 > 0", name="check_volume_lacher"),
        CheckConstraint("type IN ('normal', 'urgence')", name="check_type_lacher"),
        CheckConstraint("status IN ('en_attente', 'approuve', 'refuse', 'execute')", name="check_status_lacher"),
    )

    # Relationships
    user = relationship("User", back_populates="lachers")
    barrage = relationship("Barrage", back_populates="lachers")
    repartitions = relationship("Repartition", back_populates="lacher")
