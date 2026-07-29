import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.session import Base
from app.services.water_service import WaterService


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

    service.add_water(500, source="manual")
    service.add_water(750, source="shortcut")

    summary = service.get_dashboard_summary()

    assert summary["today_total_ml"] == 1250
    assert summary["daily_goal_ml"] == 2500
    assert summary["remaining_ml"] == 1250
    assert summary["percentage"] == 50
