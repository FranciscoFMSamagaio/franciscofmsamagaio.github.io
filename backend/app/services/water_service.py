from typing import Optional

from sqlalchemy.orm import Session

from app.models.settings import SettingsModel
from app.models.water_entry import WaterEntry
from app.repositories.settings_repository import SettingsRepository
from app.repositories.water_repository import WaterRepository


class WaterService:
    def __init__(self, db: Session):
        self.db = db
        self.settings_repository = SettingsRepository(db)
        self.water_repository = WaterRepository(db)

    def add_water(self, amount_ml: int) -> tuple[WaterEntry, SettingsModel]:
        entry = self.water_repository.create(amount_ml=amount_ml)
        settings = self._get_or_create_settings()
        return entry, settings

    def get_dashboard_summary(self) -> dict:
        settings = self._get_or_create_settings()
        today_total = self.water_repository.get_today_total()
        remaining = max(settings.daily_water_goal_ml - today_total, 0)
        percentage = min(round((today_total / settings.daily_water_goal_ml) * 100), 100) if settings.daily_water_goal_ml else 0
        latest_entry = self.db.query(WaterEntry).order_by(WaterEntry.created_at.desc()).first()

        return {
            "today_total_ml": today_total,
            "daily_goal_ml": settings.daily_water_goal_ml,
            "remaining_ml": remaining,
            "percentage": percentage,
            "latest_entry": latest_entry,
        }

    def get_history(self) -> list[WaterEntry]:
        return self.water_repository.list_history()

    def update_entry(self, entry_id: int, amount_ml: int) -> WaterEntry:
        entry = self.water_repository.get_by_id(entry_id)
        if not entry:
            raise ValueError("Water entry not found")
        return self.water_repository.update(entry, amount_ml=amount_ml)

    def delete_entry(self, entry_id: int) -> None:
        entry = self.water_repository.get_by_id(entry_id)
        if not entry:
            raise ValueError("Water entry not found")
        self.water_repository.delete(entry)

    def get_settings(self) -> SettingsModel:
        return self._get_or_create_settings()

    def update_settings(self, daily_water_goal_ml: int) -> SettingsModel:
        settings = self._get_or_create_settings()
        return self.settings_repository.update(settings, daily_water_goal_ml=daily_water_goal_ml)

    def _get_or_create_settings(self) -> SettingsModel:
        settings = self.settings_repository.get()
        if settings is None:
            return self.settings_repository.create(daily_water_goal_ml=2500)
        return settings
