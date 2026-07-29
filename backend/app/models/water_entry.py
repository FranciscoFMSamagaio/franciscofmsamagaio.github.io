from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.database.session import Base


class WaterEntry(Base):
    __tablename__ = "water_entries"

    id = Column(Integer, primary_key=True, index=True)
    amount_ml = Column(Integer, nullable=False)
    source = Column(String(50), nullable=False, default="manual")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
