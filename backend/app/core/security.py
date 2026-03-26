from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from app.core.config import settings

#configuration du "Hasher" de mots de passe(Algorithme bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")

#fonction pour verifier si un mot de passe tapé  est correspond au Hash en BD
def verify_password(plain_password:str, hashed_password:str) -> bool:
    return pwd_context.verify(plain_password,hashed_password)


#fonction pour hasher un nouveau mot de passe
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

#fonction pour Generer le JWT (expire en 60 minutes)
def create_access_token(data: dict) -> str:
    # On fait une copie des données (ex: {"sub": "hassan@barrage.ma", "role": "directeur"})
    to_encode = data.copy()

    #on ajoute la date d'expiration du token
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    #on signe le tout avec la SECRET_KEY et l'algo HS256 
    encode_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return encode_jwt