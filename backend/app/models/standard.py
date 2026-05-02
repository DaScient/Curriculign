from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column
from sqlmodel import Field, Relationship, SQLModel

EMBEDDING_DIM = 1536


class Standard(SQLModel, table=True):
    """
    A polymorphic accreditation standard (ABET, WASC, Common Core, …).
    Idiosyncratic metadata is stored in the flexible `meta` JSONB column.
    """

    __tablename__ = "standards"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    framework: str = Field(index=True)          # e.g. ABET | WASC | COMMON_CORE
    code: str = Field(index=True)               # e.g. "ABET-SO-2", "CCSS.MATH.8.G.A.1"
    title: str
    description: str
    level: Optional[str] = None                 # e.g. ILO | PLO | CLO | domain
    parent_code: Optional[str] = None           # for hierarchical nesting (WASC)
    meta: Optional[Dict[str, Any]] = Field(     # JSONB – framework-specific extras
        default=None, sa_type=None  # set via sa_column below
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # pgvector column
    embedding: Optional[List[float]] = Field(
        default=None, sa_column=Column(Vector(EMBEDDING_DIM))
    )

    mapping_results: List["MappingResult"] = Relationship(back_populates="standard")


# Import here to avoid circular dependency
from app.models.mapping_result import MappingResult  # noqa: E402
