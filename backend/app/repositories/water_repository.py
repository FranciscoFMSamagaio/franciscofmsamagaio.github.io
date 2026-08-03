from datetime import datetime, timedelta, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.water_entry import WaterEntry


class WaterRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, amount_ml: int) -> WaterEntry:
        entry = WaterEntry(amount_ml=amount_ml)
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def list_history(self) -> List[WaterEntry]:
        return self.db.query(WaterEntry).order_by(WaterEntry.created_at.desc()).all()

    def get_today_total(self) -> int:
        start_of_day = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        rows = (
            self.db.query(WaterEntry.amount_ml)
            .filter(WaterEntry.created_at >= start_of_day, WaterEntry.created_at < end_of_day)
            .all()
        )
        return sum(amount for (amount,) in rows)

    def get_by_id(self, entry_id: int) -> Optional[WaterEntry]:
        return self.db.query(WaterEntry).filter(WaterEntry.id == entry_id).first()

    def update(self, entry: WaterEntry, amount_ml: int) -> WaterEntry:
        entry.amount_ml = amount_ml
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def delete(self, entry: WaterEntry) -> None:
        self.db.delete(entry)
        self.db.commit()
