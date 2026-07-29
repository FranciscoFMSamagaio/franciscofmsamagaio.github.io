import os
import getpass
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


def build_default_database_url(username: str | None = None) -> str:
    current_user = username or getpass.getuser()
    return f"postgresql+psycopg://{current_user}@127.0.0.1:5432/personal_dashboard"


def normalize_database_url(raw_url: str) -> str:
    if not raw_url:
        return build_default_database_url()
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
            build_default_database_url(),
        )
    )
    app_base_path: str = os.getenv("APP_BASE_PATH", "/app")


settings = Settings()
