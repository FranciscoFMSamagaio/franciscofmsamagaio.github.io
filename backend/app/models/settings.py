from sqlalchemy import Column, DateTime, Integer
from sqlalchemy.sql import func

from app.database.session import Base


class SettingsModel(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    daily_water_goal_ml = Column(Integer, nullable=False, default=2500)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
