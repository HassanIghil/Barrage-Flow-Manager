from fastapi import HTTPException,Security
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError

from app.core.config import settings


#On active le cadenas dans Swagger (pour pouvoir coller le JWT)
security = HTTPBearer()

#Décrypte le Token et vérifie si la personne a le droit de passer
def role_checker(allowed_roles: list[str]):
    def verifier_role(credentials:HTTPAuthorizationCredentials = Security(security)):
        token = credentials.credentials

        try:
            # On demande à JWT de décoder le token avec la clé secrète
            payload = jwt.decode(token,settings.SECRET_KEY,algorithms=[settings.ALGORITHM])
            user_role = payload.get("role")

            if user_role is None:
                raise HTTPException(status_code=401,detail="Token invalide")

            #SI le role d'utilisateur n'est pas dans la liste autorisee
            if user_role not in allowed_roles:
                raise HTTPException(
                    status_code=403,
                    detail="⚠️ Forbidden: Vous n'avez pas le bon profil pour cette action."
                )
            
            return payload
        except PyJWTError:
            raise HTTPException(status_code=401, detail="Token expiré ou erroné")
    return verifier_role

