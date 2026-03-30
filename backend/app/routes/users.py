from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.middleware.rbac import role_checker

router = APIRouter()

# Route 1 : Créer un utilisateur (Réservé au Directeur)
@router.post("/register", dependencies=[Depends(role_checker(["directeur"]))])
def register(user_data: UserCreate, db: Session = Depends(get_db)):

    #Vérifier que l'email n'existe pas déjà
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    #Hasher le mot de passe (ne jamais stocker en clair !)
    hashed_password = get_password_hash(user_data.password)

    #Créer l'objet User en Python
    new_user = User(
        nom=user_data.nom,
        prenom=user_data.prenom,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role.value   # .value pour convertir l'Enum en string
    )

    #Sauvegarder dans MySQL
    db.add(new_user)        # Ajoute à la session
    db.commit()             # Exécute le INSERT SQL
    db.refresh(new_user)    # Recharge l'objet avec l'ID généré par MySQL

    return {"message": "Utilisateur créé avec succès", "id": new_user.id_user}


# Route 2 : Voir mon profil (Tout utilisateur connecté)
@router.get("/me", response_model=UserRead)
def get_my_profile(
    payload: dict = Depends(role_checker(["directeur", "ingenieur", "operateur"])),
    db: Session = Depends(get_db)
):
    # Le payload du JWT contient l'ID du user connecté
    user = db.query(User).filter(User.id_user == payload["id"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    return user
