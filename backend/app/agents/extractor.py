"""
Node A – CLO Extractor
Pulls Course Learning Outcomes from the raw syllabus text using an LLM.
"""
from __future__ import annotations

import json
import re
from typing import List

from langchain_openai import ChatOpenAI

from app.config import get_settings
from app.schemas import CLO, WorkflowState

settings = get_settings()

_SYSTEM = (
    "You are an expert curriculum analyst. "
    "Your task is to extract ALL Course Learning Outcomes (CLOs) from the provided syllabus text. "
    "Return ONLY a JSON array of strings, each string being one complete CLO verbatim. "
    "If no CLOs are found, return an empty array []."
)


def extract_clos(state: WorkflowState) -> WorkflowState:
    """LangGraph node: extract CLOs from raw syllabus text."""
    llm = ChatOpenAI(
        model=settings.openai_model,
        temperature=0,
        openai_api_key=settings.openai_api_key,
    )
    prompt = f"SYLLABUS TEXT:\n\n{state.raw_text[:12000]}"
    response = llm.invoke([
        {"role": "system", "content": _SYSTEM},
        {"role": "user", "content": prompt},
    ])
    content = response.content if hasattr(response, "content") else str(response)

    # Parse the JSON array
    try:
        match = re.search(r"\[.*\]", content, re.DOTALL)
        clo_list: List[str] = json.loads(match.group()) if match else []
    except Exception:
        clo_list = []

    state.clos = [CLO(text=t.strip()) for t in clo_list if t.strip()]
    return state
