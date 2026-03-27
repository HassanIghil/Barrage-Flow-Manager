from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Repartition(Base):
    __tablename__ = "repartition"

    id_lacher = Column(Integer, ForeignKey("lacher_eau.id_lacher", ondelete="CASCADE"), primary_key=True)
    id_coop = Column(Integer, ForeignKey("cooperative.id_coop", ondelete="CASCADE"), primary_key=True)
    volume_attribue_m3 = Column(Float, nullable=False)

    # Relationships
    lacher = relationship("LacherEau", back_populates="repartitions")
    cooperative = relationship("Cooperative", back_populates="repartitions")
