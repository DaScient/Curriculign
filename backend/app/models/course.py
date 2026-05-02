from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.program import Program
    from app.models.syllabus import Syllabus


class Course(SQLModel, table=True):
    __tablename__ = "courses"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    program_id: uuid.UUID = Field(foreign_key="programs.id", index=True)
    code: str = Field(index=True)  # e.g. CE-301
    title: str
    credits: Optional[int] = None
    semester: Optional[str] = None  # e.g. Fall 2024
    created_at: datetime = Field(default_factory=datetime.utcnow)

    program: Optional["Program"] = Relationship(back_populates="courses")
    syllabi: List["Syllabus"] = Relationship(back_populates="course")
