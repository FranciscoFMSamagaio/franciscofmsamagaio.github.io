from pydantic import BaseModel, Field


class SettingsBase(BaseModel):
    daily_water_goal_ml: int = Field(..., ge=1)


class SettingsCreate(SettingsBase):
    pass


class SettingsResponse(SettingsBase):
    id: int

    class Config:
        from_attributes = True
