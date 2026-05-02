"""Upload endpoint: accepts a PDF syllabus, creates DB records, triggers ingestion."""
from __future__ import annotations

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlmodel import Session

from app.config import get_settings
from app.database import get_session
from app.models.course import Course
from app.models.institution import Institution
from app.models.program import Program
from app.models.syllabus import Syllabus
from app.schemas import UploadResponse
from app.services.pdf_ingestion import ingest_syllabus

router = APIRouter(prefix="/upload", tags=["Upload"])
settings = get_settings()


def _ensure_upload_dir() -> Path:
    path = Path(settings.upload_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


@router.post("/syllabus", response_model=UploadResponse, status_code=201)
async def upload_syllabus(
    file: UploadFile = File(..., description="PDF syllabus"),
    course_code: str = Form(...),
    course_title: str = Form(...),
    institution_name: str = Form(...),
    program_name: str = Form(...),
    session: Session = Depends(get_session),
):
    """
    Upload a syllabus PDF.
    Creates Institution/Program/Course records if they do not already exist,
    then runs the ingestion pipeline (extract → chunk → embed → store).
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    content_type = file.content_type or ""
    if content_type not in ("application/pdf", "text/plain", "text/markdown"):
        allowed = ["application/pdf", "text/plain", "text/markdown"]
        if not any(file.filename.endswith(ext) for ext in [".pdf", ".txt", ".md"]):
            raise HTTPException(
                status_code=415,
                detail=f"Unsupported file type. Allowed: {allowed}",
            )

    # Check size
    contents = await file.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds {settings.max_upload_size_mb} MB limit.",
        )

    # Persist file locally
    upload_dir = _ensure_upload_dir()
    safe_name = f"{uuid.uuid4()}_{Path(file.filename).name}"
    file_path = upload_dir / safe_name
    file_path.write_bytes(contents)

    # Upsert Institution
    institution = session.exec(
        Institution.__sqlmodel_table_args__.get("select_stmt")  # type: ignore[attr-defined]
        if False
        else __import__("sqlmodel", fromlist=["select"]).select(Institution).where(
            Institution.name == institution_name
        )
    ).first()
    if not institution:
        institution = Institution(name=institution_name)
        session.add(institution)
        session.commit()
        session.refresh(institution)

    # Upsert Program
    from sqlmodel import select as sql_select
    program = session.exec(
        sql_select(Program).where(
            Program.institution_id == institution.id,
            Program.name == program_name,
        )
    ).first()
    if not program:
        program = Program(institution_id=institution.id, name=program_name)
        session.add(program)
        session.commit()
        session.refresh(program)

    # Upsert Course
    course = session.exec(
        sql_select(Course).where(
            Course.program_id == program.id,
            Course.code == course_code,
        )
    ).first()
    if not course:
        course = Course(
            program_id=program.id,
            code=course_code,
            title=course_title,
        )
        session.add(course)
        session.commit()
        session.refresh(course)

    # Create Syllabus record
    syllabus = Syllabus(course_id=course.id, filename=file.filename)
    session.add(syllabus)
    session.commit()
    session.refresh(syllabus)

    # Run ingestion pipeline (blocking for MVP; production should use a task queue)
    syllabus = ingest_syllabus(str(file_path), syllabus, session)

    return UploadResponse(
        syllabus_id=syllabus.id,
        course_id=course.id,
        filename=syllabus.filename,
        status=syllabus.status,
        message="Ingestion complete." if syllabus.status == "ready" else "Ingestion failed.",
    )
