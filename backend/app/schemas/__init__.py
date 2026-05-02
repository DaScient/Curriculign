from __future__ import annotations

from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel


# ── CLO ──────────────────────────────────────────────────────────────────────

class CLO(BaseModel):
    text: str
    source_line: Optional[int] = None


# ── Standard reference ────────────────────────────────────────────────────────

class StandardRef(BaseModel):
    id: UUID
    framework: str
    code: str
    title: str
    description: str


# ── Single mapping row ────────────────────────────────────────────────────────

class MappingRow(BaseModel):
    id: UUID
    clo_text: str
    standard: StandardRef
    similarity_score: float
    blooms_level_clo: Optional[str]
    blooms_level_standard: Optional[str]
    gap_flag: bool
    artifact_reference: Optional[str]
    coverage_status: str  # covered | partial | uncovered
    detail: Optional[Dict[str, Any]]


# ── Full analysis response ────────────────────────────────────────────────────

class AnalysisResponse(BaseModel):
    syllabus_id: UUID
    course_code: Optional[str]
    course_title: Optional[str]
    framework: str
    total_clos: int
    total_standards: int
    covered_count: int
    partial_count: int
    uncovered_count: int
    mappings: List[MappingRow]


# ── Upload response ───────────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    syllabus_id: UUID
    course_id: UUID
    filename: str
    status: str
    message: str


# ── Workflow state (internal) ─────────────────────────────────────────────────

class WorkflowState(BaseModel):
    syllabus_id: UUID
    raw_text: str
    framework: str
    clos: List[CLO] = []
    mappings: List[MappingRow] = []
    error: Optional[str] = None
