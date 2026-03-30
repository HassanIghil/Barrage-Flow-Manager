from fastapi import FastAPI
from app.routes import dashboard, alerts, releases

app = FastAPI()

# enregistrer les routes
app.include_router(dashboard.router)
app.include_router(alerts.router)
app.include_router(releases.router)

@app.get("/")
def root():
    return {"message": "API is running"}