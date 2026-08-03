import os
import getpass
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import parse_qsl, quote, urlencode, urlparse, urlunparse

from dotenv import dotenv_values, load_dotenv

load_dotenv(
    dotenv_path=Path(__file__).resolve().parents[2] / ".env",
    override=True,
)


def build_default_database_url(username: str | None = None) -> str:
    current_user = username or getpass.getuser()
    return f"postgresql+psycopg://{current_user}@127.0.0.1:5432/personal_dashboard"


def normalize_database_url(raw_url: str) -> str:
    if not raw_url:
        return build_default_database_url()

    if "[YOUR-PASSWORD]" in raw_url or "YOUR-PASSWORD" in raw_url:
        return build_default_database_url()

    if raw_url.startswith("postgresql+psycopg"):
        normalized = raw_url
    elif raw_url.startswith("postgresql://"):
        normalized = raw_url.replace("postgresql://", "postgresql+psycopg://", 1)
    else:
        return raw_url

    parsed = urlparse(normalized)
    if parsed.hostname and parsed.hostname.endswith("supabase.co"):
        query = dict(parse_qsl(parsed.query, keep_blank_values=True))
        query.setdefault("sslmode", "require")
        parsed = parsed._replace(query=urlencode(query))

    if parsed.username:
        user = quote(parsed.username)
    else:
        user = parsed.username

    if parsed.password:
        password = quote(parsed.password)
    else:
        password = parsed.password

    netloc = parsed.hostname or ""
    if user:
        netloc = user if not password else f"{user}:{password}"
        if parsed.hostname:
            netloc = f"{netloc}@{parsed.hostname}"
    if parsed.port:
        netloc = f"{netloc}:{parsed.port}"

    if parsed.hostname and parsed.hostname.endswith("supabase.co"):
        return urlunparse(parsed._replace(netloc=netloc))

    return normalized


@dataclass(frozen=True)
class Settings:
    app_name: str = "Personal Dashboard API"
    debug: bool = False
    database_url: str = ""
    app_base_path: str = "/app"

    def __post_init__(self) -> None:
        env_values = dotenv_values(Path(__file__).resolve().parents[2] / ".env")
        object.__setattr__(self, "debug", os.getenv("DEBUG", env_values.get("DEBUG", "true")).lower() == "true")
        env_url = (
            os.getenv("DATABASE_URL")
            or os.getenv("POSTGRES_URL")
            or os.getenv("DB_URL")
            or env_values.get("DATABASE_URL")
            or ""
        )
        object.__setattr__(self, "database_url", normalize_database_url(env_url))
        object.__setattr__(self, "app_base_path", os.getenv("APP_BASE_PATH", "/app"))


settings = Settings()
