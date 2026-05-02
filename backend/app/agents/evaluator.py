"""
Node C – Bloom's Taxonomy Evaluator
Determines the cognitive depth of each CLO vs its matched Standard,
and flags gaps where the CLO operates at a lower level than required.
"""
from __future__ import annotations

import json
import re
from typing import Optional

from langchain_openai import ChatOpenAI

from app.config import get_settings
from app.schemas import MappingRow, WorkflowState

settings = get_settings()

BLOOMS_LEVELS = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]
BLOOMS_ORDER = {level: i for i, level in enumerate(BLOOMS_LEVELS)}

_SYSTEM = """You are an expert in Bloom's Taxonomy applied to educational objectives.
Given a Course Learning Outcome (CLO) and an accreditation Standard, respond in JSON:
{
  "blooms_level_clo": "<one of: Remember|Understand|Apply|Analyze|Evaluate|Create>",
  "blooms_level_standard": "<one of: Remember|Understand|Apply|Analyze|Evaluate|Create>",
  "artifact_reference": "<if an assignment/exam that assesses this CLO is mentioned, quote it briefly; else null>",
  "reasoning": "<1-sentence rationale>"
}"""


def _classify(clo_text: str, standard_desc: str, llm: ChatOpenAI) -> dict:
    prompt = f"CLO: {clo_text}\n\nSTANDARD: {standard_desc}"
    response = llm.invoke([
        {"role": "system", "content": _SYSTEM},
        {"role": "user", "content": prompt},
    ])
    content = response.content if hasattr(response, "content") else str(response)
    try:
        match = re.search(r"\{.*\}", content, re.DOTALL)
        return json.loads(match.group()) if match else {}
    except Exception:
        return {}


def evaluate_depth(state: WorkflowState) -> WorkflowState:
    """LangGraph node: assess Bloom's level alignment for each mapping."""
    if not state.mappings:
        return state

    llm = ChatOpenAI(
        model=settings.openai_model,
        temperature=0,
        openai_api_key=settings.openai_api_key,
    )

    updated: list[MappingRow] = []
    for row in state.mappings:
        result = _classify(row.clo_text, row.standard.description, llm)

        clo_level: Optional[str] = result.get("blooms_level_clo")
        std_level: Optional[str] = result.get("blooms_level_standard")
        artifact: Optional[str] = result.get("artifact_reference")

        gap_flag = False
        if clo_level and std_level:
            gap_flag = BLOOMS_ORDER.get(clo_level, 0) < BLOOMS_ORDER.get(std_level, 0)

        updated.append(
            row.model_copy(
                update={
                    "blooms_level_clo": clo_level,
                    "blooms_level_standard": std_level,
                    "artifact_reference": artifact,
                    "gap_flag": gap_flag,
                    "detail": {"reasoning": result.get("reasoning")},
                }
            )
        )

    state.mappings = updated
    return state
