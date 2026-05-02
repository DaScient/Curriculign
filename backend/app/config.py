from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "postgresql://curriculign:curriculign@localhost:5432/curriculign"

    # OpenAI
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    embedding_model: str = "text-embedding-3-small"

    # App
    app_title: str = "Curriculign API"
    app_version: str = "0.1.0"
    debug: bool = False

    # Upload
    upload_dir: str = "/tmp/curriculign_uploads"
    max_upload_size_mb: int = 20

    # Chunking
    chunk_size: int = 512
    chunk_overlap: int = 64


@lru_cache
def get_settings() -> Settings:
    return Settings()
