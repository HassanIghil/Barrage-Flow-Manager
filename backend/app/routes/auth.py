from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password,create_access_token
from app.models.user import User
from app.schemas.user import UserLogin


router = APIRouter()

@router.post("/login")
def login(user_data:UserLogin, db:Session = Depends(get_db)):
    #Chercher l'utilisateur dans la BD par son email
    user = db.query(User).filter(User.email == user_data.email).first()

    #Si l'email n'existe pas en BD -> Erreur 401
    if not user:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    #Si l'email existe, on verifier le mot de passe hashe
    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    #Tout est bon! On fabrique le Token JWT
    token = create_access_token(data={
        "sub": user.email,            # sub = "subject" (qui est cette personne)
        "role": user.role,            # le rôle pour le RBAC (directeur, ingenieur...)
        "id": user.id_user             # l'ID pour les requêtes futures
    })


    return{
        "access_token": token,
        "token_type":"bearer",
        "role": user.role
    }