from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session
from app.schemas.water import WaterEntryCreate, WaterEntryUpdate
from app.services.water_service import WaterService

router = APIRouter(prefix="/water", tags=["water"])


@router.get("/today")
def get_today_summary(db: Session = Depends(get_db_session)):
    service = WaterService(db)
    summary = service.get_dashboard_summary()
    latest_entry = summary.get("latest_entry")
    if latest_entry is not None:
        summary["latest_entry"] = {
            "id": latest_entry.id,
            "amount_ml": latest_entry.amount_ml,
            "created_at": latest_entry.created_at.isoformat() if latest_entry.created_at else None,
        }
    return summary


@router.get("/history")
def get_water_history(db: Session = Depends(get_db_session)):
    service = WaterService(db)
    entries = service.get_history()
    return [
        {
            "id": entry.id,
            "amount_ml": entry.amount_ml,
            "created_at": entry.created_at.isoformat() if entry.created_at else None,
        }
        for entry in entries
    ]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_water_entry(payload: WaterEntryCreate, db: Session = Depends(get_db_session)):
    service = WaterService(db)
    entry, _ = service.add_water(amount_ml=payload.amount_ml)
    return {
        "id": entry.id,
        "amount_ml": entry.amount_ml,
        "created_at": entry.created_at.isoformat() if entry.created_at else None,
    }


@router.put("/{entry_id}")
def update_water_entry(entry_id: int, payload: WaterEntryUpdate, db: Session = Depends(get_db_session)):
    service = WaterService(db)
    try:
        entry = service.update_entry(entry_id, amount_ml=payload.amount_ml or 0)
        return {
            "id": entry.id,
            "amount_ml": entry.amount_ml,
            "created_at": entry.created_at.isoformat() if entry.created_at else None,
        }
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_water_entry(entry_id: int, db: Session = Depends(get_db_session)):
    service = WaterService(db)
    try:
        service.delete_entry(entry_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
