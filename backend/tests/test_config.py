from app.core.config import build_default_database_url, normalize_database_url


def test_normalize_database_url_uses_psycopg_driver():
    assert normalize_database_url("postgresql://postgres:postgres@127.0.0.1:5432/personal_dashboard") == (
        "postgresql+psycopg://postgres:postgres@127.0.0.1:5432/personal_dashboard"
    )


def test_normalize_database_url_keeps_existing_psycopg_driver():
    raw = "postgresql+psycopg://postgres:postgres@127.0.0.1:5432/personal_dashboard"
    assert normalize_database_url(raw) == raw


def test_build_default_database_url_uses_current_user_when_available():
    assert build_default_database_url("francisco") == (
        "postgresql+psycopg://francisco@127.0.0.1:5432/personal_dashboard"
    )
