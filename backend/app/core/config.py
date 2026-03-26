import os
from pydantic_settings import BaseSettings
from pydantic import field_validator
from dotenv import load_dotenv

#assur la charge de .env caché qui est à la racine du projet

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__),"../../../.env"))

class Settings(BaseSettings):
    #Security JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v):
        if len(v) < 32:
            raise ValueError("SECRET_KEY doit faire au moins 32 caractères !")
        return v

    # Base de données (Pydantic va lire ces valeurs depuis ton .env)
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DATABASE:str
    @property
    def DATABASE_URL(self)-> str:
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@localhost:3306/{self.MYSQL_DATABASE}"


    class Config:
        env_file = ".env"

settings = Settings()