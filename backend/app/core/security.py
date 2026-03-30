from datetime import datetime, timedelta, timezone
import jwt
import bcrypt
from app.core.config import settings

#fonction pour verifier si un mot de passe tapé  est correspond au Hash en BD
def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False


#fonction pour hasher un nouveau mot de passe
def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

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