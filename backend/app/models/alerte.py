from sqlalchemy import Column, Integer, String, ForeignKey, Text, Date, CheckConstraint, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Alerte(Base):
    __tablename__ = "alerte"

    id_alerte = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    date_creation = Column(Date, nullable=False, server_default=text("(CURRENT_DATE)"))
    id_barrage = Column(Integer, ForeignKey("barrage.id_barrage", ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        CheckConstraint("type IN ('critique', 'warning', 'info')", name="check_type_alerte"),
    )

    # Relationships
    barrage = relationship("Barrage", back_populates="alertes")
