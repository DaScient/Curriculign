"""Analysis endpoints: trigger the LangGraph workflow and return mapping JSON."""
from __future__ import annotations

import uuid
from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlmodel import Session, select

from app.agents.workflow import run_workflow
from app.database import get_session
from app.models.mapping_result import MappingResult
from app.models.standard import Standard
from app.models.syllabus import Syllabus
from app.schemas import AnalysisResponse, MappingRow, WorkflowState

router = APIRouter(prefix="/analysis", tags=["Analysis"])


def _persist_mappings(
    mappings: List[MappingRow],
    syllabus_id: uuid.UUID,
    session: Session,
) -> None:
    for row in mappings:
        record = MappingResult(
            syllabus_id=syllabus_id,
            standard_id=row.standard.id,
            clo_text=row.clo_text,
            similarity_score=row.similarity_score,
            blooms_level_clo=row.blooms_level_clo,
            blooms_level_standard=row.blooms_level_standard,
            gap_flag=row.gap_flag,
            artifact_reference=row.artifact_reference,
            coverage_status=row.coverage_status,
            detail=row.detail,
        )
        session.add(record)
    session.commit()


@router.post("/{syllabus_id}", response_model=AnalysisResponse)
def run_analysis(
    syllabus_id: uuid.UUID,
    framework: str = "ABET",
    session: Session = Depends(get_session),
):
    """
    Trigger the full LangGraph pipeline for a previously uploaded syllabus.
    Returns the structured mapping JSON.
    """
    syllabus = session.get(Syllabus, syllabus_id)
    if not syllabus:
        raise HTTPException(status_code=404, detail="Syllabus not found.")
    if syllabus.status != "ready":
        raise HTTPException(
            status_code=422,
            detail=f"Syllabus is not ready for analysis (status='{syllabus.status}').",
        )

    state = WorkflowState(
        syllabus_id=syllabus_id,
        raw_text=syllabus.raw_text or "",
        framework=framework,
    )
    final_state = run_workflow(state, session)

    # Persist results
    _persist_mappings(final_state.mappings, syllabus_id, session)

    # Build summary counters
    covered = sum(1 for m in final_state.mappings if m.coverage_status == "covered")
    partial = sum(1 for m in final_state.mappings if m.coverage_status == "partial")
    uncovered = sum(1 for m in final_state.mappings if m.coverage_status == "uncovered")

    # Resolve course info
    course_code: str | None = None
    course_title: str | None = None
    if syllabus.course:
        course_code = syllabus.course.code
        course_title = syllabus.course.title

    total_standards = session.exec(
        select(Standard).where(Standard.framework == framework)
    ).all()

    return AnalysisResponse(
        syllabus_id=syllabus_id,
        course_code=course_code,
        course_title=course_title,
        framework=framework,
        total_clos=len(final_state.clos),
        total_standards=len(total_standards),
        covered_count=covered,
        partial_count=partial,
        uncovered_count=uncovered,
        mappings=final_state.mappings,
    )


@router.get("/{syllabus_id}/results", response_model=AnalysisResponse)
def get_results(
    syllabus_id: uuid.UUID,
    session: Session = Depends(get_session),
):
    """Fetch previously computed mapping results for a syllabus."""
    syllabus = session.get(Syllabus, syllabus_id)
    if not syllabus:
        raise HTTPException(status_code=404, detail="Syllabus not found.")

    records = session.exec(
        select(MappingResult).where(MappingResult.syllabus_id == syllabus_id)
    ).all()
    if not records:
        raise HTTPException(
            status_code=404,
            detail="No analysis results found. Run POST /analysis/{id} first.",
        )

    from app.schemas import StandardRef

    mappings = [
        MappingRow(
            id=r.id,
            clo_text=r.clo_text,
            standard=StandardRef(
                id=r.standard.id,
                framework=r.standard.framework,
                code=r.standard.code,
                title=r.standard.title,
                description=r.standard.description,
            ),
            similarity_score=r.similarity_score,
            blooms_level_clo=r.blooms_level_clo,
            blooms_level_standard=r.blooms_level_standard,
            gap_flag=r.gap_flag,
            artifact_reference=r.artifact_reference,
            coverage_status=r.coverage_status,
            detail=r.detail,
        )
        for r in records
    ]

    framework = records[0].standard.framework if records else "UNKNOWN"
    covered = sum(1 for m in mappings if m.coverage_status == "covered")
    partial = sum(1 for m in mappings if m.coverage_status == "partial")
    uncovered = sum(1 for m in mappings if m.coverage_status == "uncovered")

    course_code: str | None = None
    course_title: str | None = None
    if syllabus.course:
        course_code = syllabus.course.code
        course_title = syllabus.course.title

    total_standards = session.exec(
        select(Standard).where(Standard.framework == framework)
    ).all()

    return AnalysisResponse(
        syllabus_id=syllabus_id,
        course_code=course_code,
        course_title=course_title,
        framework=framework,
        total_clos=len({m.clo_text for m in mappings}),
        total_standards=len(total_standards),
        covered_count=covered,
        partial_count=partial,
        uncovered_count=uncovered,
        mappings=mappings,
    )
