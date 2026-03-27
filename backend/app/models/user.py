from sqlalchemy import Column, Integer, String, Date, CheckConstraint, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "utilisateur"

    id_user = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    date_creation = Column(Date, nullable=False, server_default=text("(CURRENT_DATE)"))

    __table_args__ = (
        CheckConstraint("role IN ('directeur', 'ingenieur', 'operateur')", name="check_role"),
    )

    # Relationships
    lachers = relationship("LacherEau", back_populates="user")
    demandes_traitees = relationship("DemandeIrrigation", back_populates="user")
