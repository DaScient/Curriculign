"""
LangGraph workflow wiring:
  extract_clos  →  analyze_gaps  →  evaluate_depth
"""
from __future__ import annotations

from functools import partial

from langgraph.graph import END, StateGraph

from app.agents.evaluator import evaluate_depth
from app.agents.extractor import extract_clos
from app.agents.gap_analyzer import analyze_gaps
from app.schemas import WorkflowState


def build_workflow(session):  # type: ignore[type-arg]
    """
    Build and compile the LangGraph StateGraph.

    Parameters
    ----------
    session:
        SQLModel/SQLAlchemy Session used by the gap-analyzer node.
    """
    graph = StateGraph(WorkflowState)

    # Node A
    graph.add_node("extract_clos", extract_clos)
    # Node B – needs db session injected
    graph.add_node("analyze_gaps", partial(analyze_gaps, session=session))
    # Node C
    graph.add_node("evaluate_depth", evaluate_depth)

    graph.set_entry_point("extract_clos")
    graph.add_edge("extract_clos", "analyze_gaps")
    graph.add_edge("analyze_gaps", "evaluate_depth")
    graph.add_edge("evaluate_depth", END)

    return graph.compile()


def run_workflow(state: WorkflowState, session) -> WorkflowState:  # type: ignore[type-arg]
    """Execute the full agentic pipeline and return the final state."""
    app = build_workflow(session)
    result = app.invoke(state)
    return result if isinstance(result, WorkflowState) else WorkflowState(**result)
