#!/usr/bin/env python3
"""
seed_demo.py — Populate the database with:
  1. All sample standards (ABET, WASC, Common Core) with pgvector embeddings
  2. A synthetic Civil Engineering demo institution/program/course/syllabus
  3. Pre-computed demo mapping results

Usage:
    python scripts/seed_demo.py                  # full seed
    python scripts/seed_demo.py --embed-only     # re-embed standards only
    python scripts/seed_demo.py --framework ABET # seed one framework only
"""
from __future__ import annotations

import argparse
import json
import sys
import uuid
from pathlib import Path

# Ensure the app package is importable when running from project root
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlmodel import Session, select

from app.config import get_settings
from app.database import create_db_and_tables, engine
from app.models import (
    Course,
    Institution,
    MappingResult,
    Program,
    Standard,
    Syllabus,
)
from app.services.embeddings import embed_text

settings = get_settings()

STANDARDS_DIR = Path(__file__).parent.parent.parent / "data" / "sample_standards"

# ── Demo syllabus raw text (Civil Engineering 301) ───────────────────────────
DEMO_SYLLABUS_TEXT = """
CE-301 Structural Analysis — Fall 2024
State University · Department of Civil Engineering

COURSE LEARNING OUTCOMES
Upon completion of this course, students will be able to:

1. Apply the principles of static equilibrium and compatibility to analyze determinate
   and indeterminate structural systems under various load conditions.
2. Design structural members (beams, columns, trusses) that satisfy strength, stiffness,
   and stability criteria while considering public health, safety, welfare, and
   environmental factors.
3. Evaluate the structural integrity of existing infrastructure using analytical methods
   and engineering judgment, communicating findings to both technical and non-technical
   audiences.
4. Conduct laboratory experiments and interpret displacement/strain data to validate
   theoretical structural models.
5. List the major provisions of ASCE 7 load combinations and identify applicable
   load cases for standard building configurations.
6. Work effectively in multidisciplinary teams to complete a semester-long bridge
   design project that addresses cultural, economic, and societal constraints.
7. Demonstrate awareness of professional and ethical responsibilities by citing relevant
   engineering codes (ACI 318, AISC 360) in design decisions.

WEEKLY SCHEDULE (excerpt)
Week 5  — Determinate Beams: shear and moment diagrams
Week 8  — Midterm Examination covering weeks 1–7
Week 10 — Indeterminate structures: three-moment equation
Week 14 — Project 3: Bridge Design Presentation (ABET Outcome 2 artifact)

GRADING
Homework 20% | Midterm 25% | Project 3 (Bridge Design) 30% | Final Exam 25%
"""

# ── Pre-built demo mapping rows (ground-truth fixtures) ──────────────────────
DEMO_MAPPINGS = [
    {
        "clo_text": "Apply the principles of static equilibrium and compatibility to analyze determinate and indeterminate structural systems under various load conditions.",
        "standard_code": "ABET-SO-1",
        "similarity_score": 0.8934,
        "blooms_level_clo": "Apply",
        "blooms_level_standard": "Apply",
        "gap_flag": False,
        "artifact_reference": "Homework sets 1–7; Midterm Examination",
        "coverage_status": "covered",
        "detail": {"reasoning": "CLO uses 'Apply' matching the standard's expected level."},
    },
    {
        "clo_text": "Design structural members that satisfy strength, stiffness, and stability criteria while considering public health, safety, welfare, and environmental factors.",
        "standard_code": "ABET-SO-2",
        "similarity_score": 0.9210,
        "blooms_level_clo": "Create",
        "blooms_level_standard": "Evaluate",
        "gap_flag": False,
        "artifact_reference": "Project 3: Bridge Design with Safety Analysis (Week 14)",
        "coverage_status": "covered",
        "detail": {"reasoning": "Explicitly addresses safety/welfare/environmental factors; uses 'Design' (Create level)."},
    },
    {
        "clo_text": "Evaluate the structural integrity of existing infrastructure, communicating findings to both technical and non-technical audiences.",
        "standard_code": "ABET-SO-3",
        "similarity_score": 0.7812,
        "blooms_level_clo": "Evaluate",
        "blooms_level_standard": "Apply",
        "gap_flag": False,
        "artifact_reference": "Project 3 Presentation (Week 14)",
        "coverage_status": "covered",
        "detail": {"reasoning": "Communication to varied audiences directly satisfies SO-3."},
    },
    {
        "clo_text": "Conduct laboratory experiments and interpret displacement/strain data to validate theoretical structural models.",
        "standard_code": "ABET-SO-6",
        "similarity_score": 0.8651,
        "blooms_level_clo": "Analyze",
        "blooms_level_standard": "Analyze",
        "gap_flag": False,
        "artifact_reference": "Lab reports (weeks 6, 9, 12)",
        "coverage_status": "covered",
        "detail": {"reasoning": "Experimentation + data interpretation directly maps to SO-6."},
    },
    {
        "clo_text": "List the major provisions of ASCE 7 load combinations and identify applicable load cases for standard building configurations.",
        "standard_code": "ABET-SO-4",
        "similarity_score": 0.5823,
        "blooms_level_clo": "Remember",
        "blooms_level_standard": "Analyze",
        "gap_flag": True,
        "artifact_reference": None,
        "coverage_status": "partial",
        "detail": {"reasoning": "'List' and 'identify' are Remember-level verbs; SO-4 requires Analyze-level ethical reasoning."},
    },
    {
        "clo_text": "Work effectively in multidisciplinary teams to complete a semester-long bridge design project addressing cultural, economic, and societal constraints.",
        "standard_code": "ABET-SO-5",
        "similarity_score": 0.8201,
        "blooms_level_clo": "Apply",
        "blooms_level_standard": "Apply",
        "gap_flag": False,
        "artifact_reference": "Project 3: Bridge Design (team component, Week 14)",
        "coverage_status": "covered",
        "detail": {"reasoning": "Team project with cross-domain constraints satisfies SO-5."},
    },
    {
        "clo_text": "Demonstrate awareness of professional and ethical responsibilities by citing relevant engineering codes in design decisions.",
        "standard_code": "ABET-SO-7",
        "similarity_score": 0.4901,
        "blooms_level_clo": "Understand",
        "blooms_level_standard": "Apply",
        "gap_flag": True,
        "artifact_reference": None,
        "coverage_status": "uncovered",
        "detail": {"reasoning": "'Demonstrate awareness' is Understand level; SO-7 (Lifelong Learning) requires Apply-level strategy."},
    },
]


def load_standards(framework: str | None, session: Session) -> None:
    """Insert standards from JSON seed files, generating embeddings."""
    files = list(STANDARDS_DIR.glob("*.json"))
    if not files:
        print(f"  [WARN] No JSON files found in {STANDARDS_DIR}")
        return

    for path in files:
        data = json.loads(path.read_text())
        for item in data:
            fw = item.get("framework", "")
            if framework and fw != framework:
                continue

            # Check if already seeded
            existing = session.exec(
                select(Standard).where(
                    Standard.framework == fw, Standard.code == item["code"]
                )
            ).first()

            if existing:
                print(f"  [SKIP] {fw} / {item['code']} already exists")
                continue

            print(f"  [EMBED] {fw} / {item['code']} …", end=" ", flush=True)
            try:
                vec = embed_text(item["description"])
            except Exception as e:
                print(f"FAILED ({e})")
                vec = None

            std = Standard(
                framework=fw,
                code=item["code"],
                title=item["title"],
                description=item["description"],
                level=item.get("level"),
                parent_code=item.get("parent_code"),
                embedding=vec,
            )
            session.add(std)
            print("ok" if vec else "ok (no embedding)")

    session.commit()


def seed_demo_institution(session: Session) -> tuple[Institution, Program, Course, Syllabus]:
    """Create demo Civil Engineering hierarchy if not already present."""
    inst = session.exec(
        select(Institution).where(Institution.name == "State University")
    ).first()
    if not inst:
        inst = Institution(name="State University", country="USA")
        session.add(inst)
        session.commit()
        session.refresh(inst)

    prog = session.exec(
        select(Program).where(
            Program.institution_id == inst.id, Program.name == "Civil Engineering BS"
        )
    ).first()
    if not prog:
        prog = Program(
            institution_id=inst.id,
            name="Civil Engineering BS",
            degree_level="BS",
            discipline="Civil Engineering",
        )
        session.add(prog)
        session.commit()
        session.refresh(prog)

    course = session.exec(
        select(Course).where(Course.program_id == prog.id, Course.code == "CE-301")
    ).first()
    if not course:
        course = Course(
            program_id=prog.id,
            code="CE-301",
            title="Structural Analysis",
            credits=3,
            semester="Fall 2024",
        )
        session.add(course)
        session.commit()
        session.refresh(course)

    syllabus = session.exec(
        select(Syllabus).where(Syllabus.course_id == course.id)
    ).first()
    if not syllabus:
        print("  [EMBED] Demo syllabus …", end=" ", flush=True)
        try:
            vec = embed_text(DEMO_SYLLABUS_TEXT[:2000])
        except Exception:
            vec = None
        syllabus = Syllabus(
            course_id=course.id,
            filename="CE301_demo.md",
            raw_text=DEMO_SYLLABUS_TEXT,
            status="ready",
            embedding=vec,
        )
        session.add(syllabus)
        session.commit()
        session.refresh(syllabus)
        print("ok" if vec else "ok (no embedding)")

    return inst, prog, course, syllabus


def seed_demo_mappings(syllabus: Syllabus, session: Session) -> None:
    """Insert pre-computed mapping results for the demo syllabus."""
    existing = session.exec(
        select(MappingResult).where(MappingResult.syllabus_id == syllabus.id)
    ).first()
    if existing:
        print("  [SKIP] Demo mappings already exist")
        return

    for row in DEMO_MAPPINGS:
        std = session.exec(
            select(Standard).where(Standard.code == row["standard_code"])
        ).first()
        if not std:
            print(f"  [WARN] Standard {row['standard_code']} not found — skipping mapping")
            continue

        session.add(
            MappingResult(
                syllabus_id=syllabus.id,
                standard_id=std.id,
                clo_text=row["clo_text"],
                similarity_score=row["similarity_score"],
                blooms_level_clo=row["blooms_level_clo"],
                blooms_level_standard=row["blooms_level_standard"],
                gap_flag=row["gap_flag"],
                artifact_reference=row["artifact_reference"],
                coverage_status=row["coverage_status"],
                detail=row["detail"],
            )
        )
    session.commit()
    print(f"  [OK] {len(DEMO_MAPPINGS)} demo mapping rows inserted")


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed Curriculign demo data")
    parser.add_argument(
        "--embed-only", action="store_true", help="Re-generate embeddings only"
    )
    parser.add_argument(
        "--framework", default=None, help="Seed a single framework (e.g. ABET)"
    )
    args = parser.parse_args()

    print("=== Curriculign Demo Seed ===")
    print("Creating tables …")
    create_db_and_tables()

    with Session(engine) as session:
        print("\n--- Seeding standards ---")
        load_standards(args.framework, session)

        if not args.embed_only:
            print("\n--- Seeding demo institution / course / syllabus ---")
            _, _, _, syllabus = seed_demo_institution(session)

            print("\n--- Seeding demo mapping results ---")
            seed_demo_mappings(syllabus, session)

    print("\n=== Seed complete ===")
    print("Open http://localhost:3000/dashboard?demo=true to see the demo dashboard.")


if __name__ == "__main__":
    main()
