from app.core.config import normalize_database_url


def test_normalize_database_url_uses_psycopg_driver():
    assert normalize_database_url("postgresql://postgres:postgres@127.0.0.1:5432/personal_dashboard") == (
        "postgresql+psycopg://postgres:postgres@127.0.0.1:5432/personal_dashboard"
    )


def test_normalize_database_url_keeps_existing_psycopg_driver():
    raw = "postgresql+psycopg://postgres:postgres@127.0.0.1:5432/personal_dashboard"
    assert normalize_database_url(raw) == raw
