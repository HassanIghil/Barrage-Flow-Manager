FROM python:3.12-slim

WORKDIR /app

# Installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

EXPOSE 8000

# Commande pour démarrer FastAPI (host 0.0.0.0 car on est dans Docker)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
