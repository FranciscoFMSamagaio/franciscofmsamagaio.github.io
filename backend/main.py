from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.settings import router as settings_router
from app.api.routes.water import router as water_router
from app.core.config import settings
from app.database.session import Base, engine
from app.models import SettingsModel, WaterEntry

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(water_router)
app.include_router(settings_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
