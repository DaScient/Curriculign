"""
Node B – Gap Analyzer
Runs pgvector similarity search to match each CLO against Standards,
then flags coverage gaps.
"""
from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, Optional

from sqlmodel import Session

from app.config import get_settings
from app.models.standard import Standard
from app.schemas import MappingRow, StandardRef, WorkflowState
from app.services.embeddings import embed_text, similarity_search

settings = get_settings()

# Similarity threshold above which a CLO is considered "covered"
COVERED_THRESHOLD = 0.75
PARTIAL_THRESHOLD = 0.55


def _build_mapping_row(
    clo_text: str,
    standard: Standard,
    similarity: float,
) -> MappingRow:
    status = (
        "covered"
        if similarity >= COVERED_THRESHOLD
        else ("partial" if similarity >= PARTIAL_THRESHOLD else "uncovered")
    )
    return MappingRow(
        id=uuid.uuid4(),
        clo_text=clo_text,
        standard=StandardRef(
            id=standard.id,
            framework=standard.framework,
            code=standard.code,
            title=standard.title,
            description=standard.description,
        ),
        similarity_score=round(similarity, 4),
        blooms_level_clo=None,      # filled by Node C
        blooms_level_standard=None, # filled by Node C
        gap_flag=False,             # filled by Node C
        artifact_reference=None,    # filled by Node C
        coverage_status=status,
        detail=None,
    )


def analyze_gaps(state: WorkflowState, session: Session) -> WorkflowState:
    """LangGraph node: vectorize CLOs and search standards."""
    mappings: list[MappingRow] = []

    for clo in state.clos:
        query_vec = embed_text(clo.text)
        results = similarity_search(
            query_vec=query_vec,
            framework=state.framework,
            session=session,
            top_k=5,
        )
        if not results:
            continue
        # Take best match per CLO
        best_standard, best_sim = results[0]
        mappings.append(_build_mapping_row(clo.text, best_standard, best_sim))

    state.mappings = mappings
    return state
