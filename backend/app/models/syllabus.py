from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.mapping_result import MappingResult

EMBEDDING_DIM = 1536  # text-embedding-3-small dimension


class Syllabus(SQLModel, table=True):
    __tablename__ = "syllabi"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    course_id: uuid.UUID = Field(foreign_key="courses.id", index=True)
    filename: str
    raw_text: Optional[str] = None
    status: str = Field(default="pending")  # pending | processing | ready | error
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # pgvector column – stored as the mean of chunk embeddings
    embedding: Optional[List[float]] = Field(
        default=None, sa_column=Column(Vector(EMBEDDING_DIM))
    )

    course: Optional["Course"] = Relationship(back_populates="syllabi")
    mapping_results: List["MappingResult"] = Relationship(back_populates="syllabus")
