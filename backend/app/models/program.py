from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.institution import Institution
    from app.models.course import Course


class Program(SQLModel, table=True):
    __tablename__ = "programs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    institution_id: uuid.UUID = Field(foreign_key="institutions.id", index=True)
    name: str
    degree_level: Optional[str] = None  # e.g. BS, MS, PhD
    discipline: Optional[str] = None  # e.g. Civil Engineering
    created_at: datetime = Field(default_factory=datetime.utcnow)

    institution: Optional["Institution"] = Relationship(back_populates="programs")
    courses: List["Course"] = Relationship(back_populates="program")
