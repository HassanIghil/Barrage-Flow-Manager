from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker

#on importe les settings 
from app.core.config import settings

#creation d'engine SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping = True,  #pour Réveille MySQL s'il est endormi
    pool_recycle=3600    #Renouvelle la connexion chaque heure pour évite les déconnexions
)

#creation d'un "Usine" a sessions (pour chaque requete HTTP aura sa session)
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

#creation de la classe de basse pour tout les Modeles 
Base = declarative_base()

#fonction pour le connection a la BD
def get_db():
    db = SessionLocal()
    try:
        yield db  #fournit le connexion
    finally:
        db.close()  #garantie la connexion se ferme aprese chaque requete  (OWASP applique)