from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session
from app.schemas.water import WaterEntryCreate, WaterEntryResponse, WaterEntryUpdate
from app.services.water_service import WaterService

router = APIRouter(prefix="/water", tags=["water"])


@router.get("/today", response_model=dict)
def get_today_summary(db: Session = Depends(get_db_session)):
    service = WaterService(db)
    return service.get_dashboard_summary()


@router.get("/history", response_model=list[WaterEntryResponse])
def get_water_history(db: Session = Depends(get_db_session)):
    service = WaterService(db)
    return service.get_history()


@router.post("", response_model=WaterEntryResponse, status_code=status.HTTP_201_CREATED)
def create_water_entry(payload: WaterEntryCreate, db: Session = Depends(get_db_session)):
    service = WaterService(db)
    entry, _ = service.add_water(amount_ml=payload.amount_ml, source=payload.source)
    return entry


@router.put("/{entry_id}", response_model=WaterEntryResponse)
def update_water_entry(entry_id: int, payload: WaterEntryUpdate, db: Session = Depends(get_db_session)):
    service = WaterService(db)
    try:
        return service.update_entry(entry_id, amount_ml=payload.amount_ml or 0, source=payload.source or "manual")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_water_entry(entry_id: int, db: Session = Depends(get_db_session)):
    service = WaterService(db)
    try:
        service.delete_entry(entry_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
