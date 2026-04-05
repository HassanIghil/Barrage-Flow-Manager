from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.middleware.rbac import role_checker
from typing import List

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

# Route 3 : Modifier mon mot de passe
@router.post("/change-password")
def change_password(
    old_password: str,
    new_password: str,
    payload: dict = Depends(role_checker(["directeur", "ingenieur", "operateur"])),
    db: Session = Depends(get_db)
):
    # Récupérer l'utilisateur connecté
    user = db.query(User).filter(User.id_user == payload["id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # Vérifier l'ancien mot de passe
    if not verify_password(old_password, user.password):
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")

    # Hasher et mettre à jour le mot de passe
    user.password = get_password_hash(new_password)
    db.commit()

    return {"message": "Mot de passe mis à jour avec succès"}

# ------------------------------------------------------------
# ROUTES D'ADMINISTRATION (RÉSERVÉES AU DIRECTEUR)
# ------------------------------------------------------------

# Route 4 : Lister tous les utilisateurs
@router.get("/", response_model=List[UserRead], dependencies=[Depends(role_checker(["directeur"]))])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# Route 5 : Modifier un utilisateur par son ID
@router.put("/{id_user}", response_model=UserRead, dependencies=[Depends(role_checker(["directeur"]))])
def update_user(id_user: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_user == id_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # On met à jour seulement les champs fournis (Partial Update)
    if user_update.nom: user.nom = user_update.nom
    if user_update.prenom: user.prenom = user_update.prenom
    if user_update.email: 
        # Vérifier si l'email n'est pas déjà pris par quelqu'un d'autre
        check_email = db.query(User).filter(User.email == user_update.email, User.id_user != id_user).first()
        if check_email:
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé par un autre compte")
        user.email = user_update.email
    if user_update.role: user.role = user_update.role.value

    db.commit()
    db.refresh(user)
    return user

# Route 6 : Supprimer un utilisateur
@router.delete("/{id_user}", dependencies=[Depends(role_checker(["directeur"]))])
def delete_user(id_user: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_user == id_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    db.delete(user)
    db.commit()
    return {"message": f"L'utilisateur {id_user} a été supprimé"}
