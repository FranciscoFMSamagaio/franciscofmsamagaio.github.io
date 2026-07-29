from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.models.settings import SettingsModel


class SettingsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self) -> Optional[SettingsModel]:
        return self.db.query(SettingsModel).order_by(SettingsModel.id.asc()).first()

    def create(self, daily_water_goal_ml: int) -> SettingsModel:
        settings = SettingsModel(daily_water_goal_ml=daily_water_goal_ml)
        self.db.add(settings)
        self.db.commit()
        self.db.refresh(settings)
        return settings

    def update(self, settings: SettingsModel, daily_water_goal_ml: int) -> SettingsModel:
        settings.daily_water_goal_ml = daily_water_goal_ml
        settings.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(settings)
        return settings
