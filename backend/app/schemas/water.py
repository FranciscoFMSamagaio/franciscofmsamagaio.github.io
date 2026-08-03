from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class WaterEntryBase(BaseModel):
    amount_ml: int = Field(..., ge=1)


class WaterEntryCreate(WaterEntryBase):
    pass


class WaterEntryUpdate(BaseModel):
    amount_ml: Optional[int] = Field(default=None, ge=1)


class WaterEntryResponse(WaterEntryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
