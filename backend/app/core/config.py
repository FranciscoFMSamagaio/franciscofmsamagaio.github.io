import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


def normalize_database_url(raw_url: str) -> str:
    if not raw_url:
        return "postgresql+psycopg://postgres:postgres@127.0.0.1:5432/personal_dashboard"
    if raw_url.startswith("postgresql+psycopg"):
        return raw_url
    if raw_url.startswith("postgresql://"):
        return raw_url.replace("postgresql://", "postgresql+psycopg://", 1)
    return raw_url


@dataclass(frozen=True)
class Settings:
    app_name: str = "Personal Dashboard API"
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"
    database_url: str = normalize_database_url(
        os.getenv(
            "DATABASE_URL",
            "postgresql://postgres:postgres@127.0.0.1:5432/personal_dashboard",
        )
    )
    app_base_path: str = os.getenv("APP_BASE_PATH", "/app")


settings = Settings()
