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


def test_history_summary_groups_last_ten_days(db_session):
    base_time = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    db_session.add(WaterEntry(amount_ml=200, created_at=base_time))
    db_session.add(WaterEntry(amount_ml=300, created_at=base_time - timedelta(days=1)))
    db_session.add(WaterEntry(amount_ml=400, created_at=base_time - timedelta(days=11)))
    db_session.commit()

    service = WaterService(db_session)
    history = service.get_history_summary(limit_days=10)

    assert len(history) == 10
    assert history[0]["day"] == base_time.date().isoformat()
    assert history[0]["total_ml"] == 200
    assert history[1]["day"] == (base_time - timedelta(days=1)).date().isoformat()
    assert history[1]["total_ml"] == 300
    assert history[-1]["day"] == (base_time - timedelta(days=9)).date().isoformat()
    assert history[-1]["total_ml"] == 0
