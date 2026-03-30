from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.dashboard import router as dashboard_router
from app.routes.alerts import router as alerts_router
from app.routes.releases import router as releases_router

app = FastAPI(title="Barrage-Flow-Manager API")

#Configuration CORS sécurisée
# Seul le frontend React (port 5173) peut appeler cette API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth route
app.include_router(auth_router, prefix="/api/auth", tags=["Authentification"])

# Register and @Me routes
app.include_router(users_router, prefix="/api/users", tags=["Utilisateurs"])

# Aabir's Routes
app.include_router(dashboard_router, tags=["Dashboard"])
app.include_router(alerts_router, tags=["Alertes"])
app.include_router(releases_router)

