"""Tests for the PDF ingestion pipeline."""
from __future__ import annotations

import os
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from app.services.pdf_ingestion import _chunk_text, _extract_text, _mean_embedding


# ── _chunk_text ───────────────────────────────────────────────────────────────

def test_chunk_text_basic():
    """Long text should be split into multiple chunks."""
    long_text = "This is a sentence. " * 200
    chunks = _chunk_text(long_text)
    assert len(chunks) > 1


def test_chunk_text_short():
    """Short text should remain a single chunk."""
    short = "Hello world."
    chunks = _chunk_text(short)
    assert len(chunks) == 1
    assert chunks[0] == short


def test_chunk_text_empty():
    """Empty string should return an empty list or single empty chunk."""
    chunks = _chunk_text("")
    assert isinstance(chunks, list)


# ── _mean_embedding ───────────────────────────────────────────────────────────

def test_mean_embedding_single():
    vecs = [[1.0, 2.0, 3.0]]
    result = _mean_embedding(vecs)
    assert result == pytest.approx([1.0, 2.0, 3.0])


def test_mean_embedding_multiple():
    vecs = [[0.0, 0.0, 0.0], [2.0, 4.0, 6.0]]
    result = _mean_embedding(vecs)
    assert result == pytest.approx([1.0, 2.0, 3.0])


def test_mean_embedding_empty():
    """Empty list should return a zero vector of the expected dimension."""
    result = _mean_embedding([])
    assert len(result) == 1536
    assert all(v == 0.0 for v in result)


# ── _extract_text ─────────────────────────────────────────────────────────────

def test_extract_text_plain_file():
    """Plain text files should be read directly."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".txt", delete=False, encoding="utf-8"
    ) as f:
        f.write("Hello from a text file.")
        tmp_path = f.name
    try:
        result = _extract_text(tmp_path)
        assert "Hello from a text file." in result
    finally:
        os.unlink(tmp_path)


def test_extract_text_markdown_file():
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".md", delete=False, encoding="utf-8"
    ) as f:
        f.write("# Syllabus\n\n## CLOs\n1. Design a bridge.")
        tmp_path = f.name
    try:
        result = _extract_text(tmp_path)
        assert "Design a bridge" in result
    finally:
        os.unlink(tmp_path)
