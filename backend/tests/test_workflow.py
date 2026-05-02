"""Tests for individual LangGraph agent nodes (mocked LLM calls)."""
from __future__ import annotations

import uuid
from unittest.mock import MagicMock, patch

import pytest

from app.agents.evaluator import BLOOMS_ORDER, evaluate_depth
from app.agents.extractor import extract_clos
from app.schemas import CLO, MappingRow, StandardRef, WorkflowState


# ── Helpers ───────────────────────────────────────────────────────────────────

def _make_state(**kwargs) -> WorkflowState:
    defaults = dict(
        syllabus_id=uuid.uuid4(),
        raw_text="Sample syllabus text.",
        framework="ABET",
    )
    defaults.update(kwargs)
    return WorkflowState(**defaults)


def _make_mapping_row(clo: str = "Design a system.", std_code: str = "ABET-SO-2") -> MappingRow:
    return MappingRow(
        id=uuid.uuid4(),
        clo_text=clo,
        standard=StandardRef(
            id=uuid.uuid4(),
            framework="ABET",
            code=std_code,
            title="Engineering Design",
            description="Apply engineering design considering public health and safety.",
        ),
        similarity_score=0.88,
        blooms_level_clo=None,
        blooms_level_standard=None,
        gap_flag=False,
        artifact_reference=None,
        coverage_status="covered",
        detail=None,
    )


# ── Node A: Extractor ─────────────────────────────────────────────────────────

class TestExtractor:
    def test_extracts_clos_from_llm_response(self):
        mock_response = MagicMock()
        mock_response.content = '["Design a bridge.", "Evaluate structural loads."]'

        with patch("app.agents.extractor.ChatOpenAI") as MockLLM:
            MockLLM.return_value.invoke.return_value = mock_response
            state = _make_state(raw_text="Syllabus with CLOs listed here.")
            result = extract_clos(state)

        assert len(result.clos) == 2
        assert result.clos[0].text == "Design a bridge."
        assert result.clos[1].text == "Evaluate structural loads."

    def test_handles_empty_clo_list(self):
        mock_response = MagicMock()
        mock_response.content = "[]"

        with patch("app.agents.extractor.ChatOpenAI") as MockLLM:
            MockLLM.return_value.invoke.return_value = mock_response
            state = _make_state(raw_text="Syllabus with no CLOs.")
            result = extract_clos(state)

        assert result.clos == []

    def test_handles_malformed_llm_response(self):
        mock_response = MagicMock()
        mock_response.content = "I could not find any CLOs in this document."

        with patch("app.agents.extractor.ChatOpenAI") as MockLLM:
            MockLLM.return_value.invoke.return_value = mock_response
            state = _make_state()
            result = extract_clos(state)

        assert result.clos == []


# ── Node C: Evaluator ─────────────────────────────────────────────────────────

class TestEvaluator:
    def test_blooms_order_is_ascending(self):
        assert BLOOMS_ORDER["Remember"] < BLOOMS_ORDER["Understand"]
        assert BLOOMS_ORDER["Understand"] < BLOOMS_ORDER["Apply"]
        assert BLOOMS_ORDER["Apply"] < BLOOMS_ORDER["Analyze"]
        assert BLOOMS_ORDER["Analyze"] < BLOOMS_ORDER["Evaluate"]
        assert BLOOMS_ORDER["Evaluate"] < BLOOMS_ORDER["Create"]

    def test_gap_flag_set_when_clo_depth_below_standard(self):
        mock_response = MagicMock()
        mock_response.content = (
            '{"blooms_level_clo": "Remember", "blooms_level_standard": "Analyze",'
            ' "artifact_reference": null, "reasoning": "CLO too shallow."}'
        )

        with patch("app.agents.evaluator.ChatOpenAI") as MockLLM:
            MockLLM.return_value.invoke.return_value = mock_response
            state = _make_state(
                clos=[CLO(text="List engineering codes.")],
                mappings=[_make_mapping_row(clo="List engineering codes.")],
            )
            result = evaluate_depth(state)

        assert result.mappings[0].gap_flag is True
        assert result.mappings[0].blooms_level_clo == "Remember"
        assert result.mappings[0].blooms_level_standard == "Analyze"

    def test_no_gap_when_clo_depth_meets_standard(self):
        mock_response = MagicMock()
        mock_response.content = (
            '{"blooms_level_clo": "Create", "blooms_level_standard": "Evaluate",'
            ' "artifact_reference": "Project 3", "reasoning": "CLO meets standard."}'
        )

        with patch("app.agents.evaluator.ChatOpenAI") as MockLLM:
            MockLLM.return_value.invoke.return_value = mock_response
            state = _make_state(
                clos=[CLO(text="Design a structural system.")],
                mappings=[_make_mapping_row(clo="Design a structural system.")],
            )
            result = evaluate_depth(state)

        assert result.mappings[0].gap_flag is False
        assert result.mappings[0].artifact_reference == "Project 3"

    def test_empty_mappings_passthrough(self):
        state = _make_state(mappings=[])
        result = evaluate_depth(state)
        assert result.mappings == []
