# Changelog

All notable changes to Curriculign are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Monorepo scaffold: `backend/` (FastAPI) + `frontend/` (Next.js 14) + `data/`
- Polymorphic Standard Engine — single `standards` table with `framework` discriminator
  and `JSONB` metadata column supporting ABET, WASC, and Common Core simultaneously
- Six PostgreSQL tables: `institutions`, `programs`, `courses`, `syllabi`,
  `standards`, `mapping_results` — all with UUID primary keys
- `pgvector` integration: 1536-dim embedding columns on `syllabi` and `standards`
- Three-node LangGraph agentic pipeline:
  - **Node A — Extractor**: GPT-4o-mini extracts CLOs from raw syllabus text
  - **Node B — Gap Analyzer**: cosine similarity search against pgvector standard index
  - **Node C — Evaluator**: Bloom's Taxonomy level classification + Artifact Locator
- FastAPI endpoints:
  - `POST /api/v1/upload/syllabus` — multipart PDF upload with ingestion pipeline
  - `POST /api/v1/analysis/{id}?framework=` — trigger full agentic workflow
  - `GET  /api/v1/analysis/{id}/results` — retrieve stored mapping JSON
- PDF ingestion pipeline: Unstructured.io extraction → RecursiveCharacterTextSplitter
  chunking → OpenAI embeddings → mean-pooled vector stored in pgvector
- Next.js 14 frontend:
  - Marketing landing page with Hero, Features, How It Works, Frameworks, and CTA sections
  - Drag-and-drop syllabus upload page with real-time ingestion status
  - Curriculum Dashboard: Stats Cards, Coverage Heatmap, TanStack Table data grid
  - Demo mode at `/dashboard?demo=true` (no API key required)
  - Framework selector: ABET / WASC / Common Core
- Synthetic Syllabus Generator CLI (`data/synthetic_generator.py`):
  - Compliance levels: `100% Compliant`, `Missing Safety Factor`, `Low Cognitive Depth`
  - Outputs structured Markdown files to `data/output/`
- Sample standard seed data: ABET (7 outcomes), WASC (5 competencies + ILO), Common Core (sample)
- `backend/scripts/seed_demo.py` — seeds standards + demo Civil Engineering mapping data
- Docker Compose stack: `pgvector/pgvector:pg16`, FastAPI, Next.js
- Dockerfiles for both `backend/` and `frontend/`
- `docs/`: architecture, API reference, deployment guide, demo walkthrough
- MIT License

---

## [0.1.0] — MVP Target

> This is the version tag to be cut once the unreleased work above passes CI.

[Unreleased]: https://github.com/DaScient/Curriculign/compare/HEAD
