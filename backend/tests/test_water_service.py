from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.session import Base
from app.models.water_entry import WaterEntry
from app.services.water_service import WaterService
from main import app


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:", future=True)
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_dashboard_summary_computes_progress(db_session):
    service = WaterService(db_session)

    service.add_water(500)
    service.add_water(750)

    summary = service.get_dashboard_summary()

    assert summary["today_total_ml"] == 1250
    assert summary["daily_goal_ml"] == 2500
    assert summary["remaining_ml"] == 1250
    assert summary["percentage"] == 50


def test_today_summary_ignores_old_entries_and_excludes_source(db_session):
    old_entry = WaterEntry(amount_ml=400, created_at=datetime.now(timezone.utc) - timedelta(days=1))
    today_entry = WaterEntry(amount_ml=300, created_at=datetime.now(timezone.utc))
    db_session.add(old_entry)
    db_session.add(today_entry)
    db_session.commit()

    service = WaterService(db_session)
    summary = service.get_dashboard_summary()

    assert summary["today_total_ml"] == 300

    client = TestClient(app)
    response = client.get("/water/today")
    payload = response.json()

    assert payload["today_total_ml"] == 300
    assert "source" not in payload
    assert payload["latest_entry"] is None or "source" not in payload["latest_entry"]
