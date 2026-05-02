from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.syllabus import Syllabus
    from app.models.standard import Standard


class MappingResult(SQLModel, table=True):
    __tablename__ = "mapping_results"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    syllabus_id: uuid.UUID = Field(foreign_key="syllabi.id", index=True)
    standard_id: uuid.UUID = Field(foreign_key="standards.id", index=True)

    clo_text: str                        # extracted CLO verbatim
    similarity_score: float = 0.0        # cosine similarity [0, 1]
    blooms_level_clo: Optional[str] = None   # e.g. "Apply"
    blooms_level_standard: Optional[str] = None  # e.g. "Analyze"
    gap_flag: bool = False               # True → CLO depth < Standard depth
    artifact_reference: Optional[str] = None  # ABET: which assignment covers this
    coverage_status: str = "uncovered"   # covered | partial | uncovered
    detail: Optional[Dict[str, Any]] = Field(default=None)  # JSONB extra info

    created_at: datetime = Field(default_factory=datetime.utcnow)

    syllabus: Optional["Syllabus"] = Relationship(back_populates="mapping_results")
    standard: Optional["Standard"] = Relationship(back_populates="mapping_results")
