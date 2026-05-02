"""PDF ingestion pipeline: extract → chunk → embed → store."""
from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import List

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from sqlmodel import Session

from app.config import get_settings
from app.models.syllabus import Syllabus

settings = get_settings()


def _extract_text(file_path: str) -> str:
    """Extract raw text from a PDF or plain-text file."""
    suffix = Path(file_path).suffix.lower()
    if suffix == ".pdf":
        try:
            from unstructured.partition.pdf import partition_pdf  # type: ignore

            elements = partition_pdf(filename=file_path, strategy="hi_res")
            return "\n".join(str(el) for el in elements)
        except Exception:
            # Fallback to PyPDF2
            import PyPDF2  # type: ignore

            text_parts: List[str] = []
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text_parts.append(page.extract_text() or "")
            return "\n".join(text_parts)
    # Plain text / markdown
    return Path(file_path).read_text(encoding="utf-8", errors="replace")


def _chunk_text(text: str) -> List[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    return splitter.split_text(text)


def _mean_embedding(embeddings: List[List[float]]) -> List[float]:
    if not embeddings:
        return [0.0] * 1536
    dim = len(embeddings[0])
    total = [0.0] * dim
    for vec in embeddings:
        for i, v in enumerate(vec):
            total[i] += v
    return [v / len(embeddings) for v in total]


def ingest_syllabus(
    file_path: str,
    syllabus: Syllabus,
    session: Session,
) -> Syllabus:
    """
    Full ingestion pipeline for a syllabus file.
    Updates the Syllabus ORM object in-place and persists it.
    """
    syllabus.status = "processing"
    session.add(syllabus)
    session.commit()

    try:
        raw_text = _extract_text(file_path)
        chunks = _chunk_text(raw_text)

        embedder = OpenAIEmbeddings(
            model=settings.embedding_model,
            openai_api_key=settings.openai_api_key,
        )
        chunk_embeddings = embedder.embed_documents(chunks)
        mean_vec = _mean_embedding(chunk_embeddings)

        syllabus.raw_text = raw_text
        syllabus.embedding = mean_vec
        syllabus.status = "ready"
    except Exception as exc:
        syllabus.status = "error"
        syllabus.raw_text = f"ERROR: {exc}"

    session.add(syllabus)
    session.commit()
    session.refresh(syllabus)
    return syllabus
