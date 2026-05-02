from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text
from app.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
)


def create_db_and_tables() -> None:
    """Create all tables and enable pgvector extension."""
    with Session(engine) as session:
        session.exec(text("CREATE EXTENSION IF NOT EXISTS vector"))  # type: ignore[call-overload]
        session.commit()
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
