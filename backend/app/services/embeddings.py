"""Embedding helpers shared across agents and services."""
from __future__ import annotations

from typing import List

from langchain_openai import OpenAIEmbeddings
from sqlmodel import Session, select

from app.config import get_settings
from app.models.standard import Standard

settings = get_settings()

_embedder: OpenAIEmbeddings | None = None


def get_embedder() -> OpenAIEmbeddings:
    global _embedder
    if _embedder is None:
        _embedder = OpenAIEmbeddings(
            model=settings.embedding_model,
            openai_api_key=settings.openai_api_key,
        )
    return _embedder


def embed_text(text: str) -> List[float]:
    return get_embedder().embed_query(text)


def similarity_search(
    query_vec: List[float],
    framework: str,
    session: Session,
    top_k: int = 10,
) -> List[tuple[Standard, float]]:
    """
    Return top-k standards (with cosine similarity) for a given framework
    using pgvector's <=> operator.
    """
    from sqlalchemy import func, text

    vec_str = "[" + ",".join(str(v) for v in query_vec) + "]"
    stmt = (
        select(
            Standard,
            func.cast(
                1 - Standard.embedding.op("<=>")(text(f"'{vec_str}'::vector")),
                float,
            ).label("similarity"),
        )
        .where(Standard.framework == framework)
        .where(Standard.embedding.is_not(None))
        .order_by(text(f"embedding <=> '{vec_str}'::vector"))
        .limit(top_k)
    )
    rows = session.exec(stmt).all()  # type: ignore[arg-type]
    return [(row[0], row[1]) for row in rows]
