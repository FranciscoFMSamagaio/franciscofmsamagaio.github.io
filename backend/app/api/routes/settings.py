from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session
from app.schemas.settings import SettingsResponse, SettingsCreate
from app.services.water_service import WaterService

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db_session)):
    service = WaterService(db)
    return service.get_settings()


@router.put("", response_model=SettingsResponse)
def update_settings(payload: SettingsCreate, db: Session = Depends(get_db_session)):
    service = WaterService(db)
    return service.update_settings(payload.daily_water_goal_ml)
