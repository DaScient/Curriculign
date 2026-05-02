# Curriculign

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)](https://www.python.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL + pgvector](https://img.shields.io/badge/PostgreSQL-pgvector-336791?logo=postgresql)](https://github.com/pgvector/pgvector)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.1-blueviolet)](https://github.com/langchain-ai/langgraph)

> **Align every course to every standard — automatically.**
>
> Curriculign is an enterprise EdTech platform that uses AI agents to map Course Learning
> Outcomes (CLOs) to Program Learning Outcomes (PLOs) and accreditation standards —
> covering **ABET**, **WASC**, and **Common Core** from a single polymorphic backend.

---

## Table of Contents

1. [Why Curriculign](#why-curriculign)
2. [Feature Tour](#feature-tour)
3. [Architecture](#architecture)
4. [Monorepo Layout](#monorepo-layout)
5. [Quick Start](#quick-start)
6. [Running the Demo](#running-the-demo)
7. [API Reference](#api-reference)
8. [Supported Frameworks](#supported-frameworks)
9. [Roadmap](#roadmap)
10. [Contributing](#contributing)
11. [License](#license)

---

## Why Curriculign

Accreditation teams at universities spend thousands of hours manually cross-referencing syllabi
against standards before every review cycle. A single ABET self-study document can take a
department chair 6–12 months to compile. A WASC institutional review touches every program
across campus simultaneously. K-12 teachers spend hours hand-tagging lesson plans with
Common Core codes in their LMS.

**Curriculign turns that process from months into minutes.**

| Pain Today | Curriculign Solution |
|---|---|
| Manual spreadsheet mapping | AI-extracted CLOs auto-matched to standards via semantic search |
| Qualitative judgments on alignment | Cosine similarity scores + Bloom's Taxonomy depth analysis |
| "Where is Outcome 2 assessed?" | Artifact Locator flags the exact assignment in the syllabus |
| Different tools for ABET vs WASC vs K-12 | Polymorphic Standard Engine — one backend, any framework |
| Cold-start data problem | Built-in Synthetic Syllabus Generator for controlled test data |

---

## Feature Tour

### Three-Node LangGraph Agentic Pipeline

```
Upload PDF / Markdown / Text
         |
         v
+---------------------------+
| Node A  ·  CLO Extractor  |   GPT-4o-mini reads the document and
|                           |   returns a JSON array of every Course
|                           |   Learning Outcome verbatim.
+-------------+-------------+
              |
              v
+---------------------------+
| Node B  ·  Gap Analyzer   |   Each CLO is embedded with
|                           |   text-embedding-3-small and matched
|                           |   against the pgvector index:
|                           |     Covered   >= 0.75 similarity
|                           |     Partial   >= 0.55 similarity
|                           |     Uncovered  < 0.55 similarity
+-------------+-------------+
              |
              v
+---------------------------+
| Node C  ·  Bloom Eval.    |   For each CLO+Standard pair the LLM
|                           |   assigns Bloom's Taxonomy levels,
|                           |   detects cognitive depth gaps, and
|                           |   locates the artifact (assignment /
|                           |   exam) that evidences the outcome.
+---------------------------+
              |
              v
     Structured JSON
              |
              v
    React Dashboard
```

### Multi-Framework Polymorphic Standard Engine

One database schema supports every accreditation framework without backend code changes.
A universal `standards` table stores the vector embedding for semantic search alongside a
flexible `JSONB` column for framework-specific metadata:

| Framework | Metadata in JSONB |
|---|---|
| ABET | `includes_safety`, `performance_indicators[]`, `version` |
| WASC | `competency_type`, `ilo_number`, `nesting_level` |
| Common Core | `subject`, `grade`, `domain`, `cluster`, `ccss_code` |

### Curriculum Dashboard

- **Stats Cards** — Total CLOs, Covered / Partial / Uncovered counts, coverage percentage
- **Coverage Heatmap** — Color-coded CLO × Standard grid: green (covered), amber (partial), red (uncovered)
- **Data Grid** (TanStack Table v8) — Sortable, filterable CLO × Standard matrix with Bloom's level badges and artifact links
- **Framework Selector** — Switch between ABET, WASC, and Common Core in real time
- **Demo Mode** — Pre-loaded fixture data at `/dashboard?demo=true`, no API key required

### Drag-and-Drop Upload

Clean upload interface with real-time ingestion status:
`pending → processing → ready → (analysis available)`

Accepts PDF, plain text, and Markdown (generated by the Synthetic Syllabus Generator).

### Synthetic Syllabus Generator

CLI tool (`data/synthetic_generator.py`) generating compliance-controlled test syllabi:

| Compliance Level | What the LLM Does |
|---|---|
| `100% Compliant` | Perfect CLO alignment, high Bloom's verbs, all safety/welfare language present |
| `Missing Safety Factor` | Subtly omits ABET Outcome 2 safety/welfare/public-health language |
| `Low Cognitive Depth` | Replaces Design/Evaluate/Analyze verbs with Define/List/Recall |

Feed any generated file into the UI to see the Gap Analyzer detect the planted flaw in real time.

---

## Architecture

```
+------------------------------------------------------------------+
|                        Curriculign                               |
|                                                                  |
|  +-----------------------+    +------------------------------+   |
|  |  Next.js 14           |    |  FastAPI  (Python 3.11)      |   |
|  |  App Router           |<-->|                              |   |
|  |  TypeScript           |    |  POST /api/v1/upload/        |   |
|  |  Tailwind CSS         |    |         syllabus             |   |
|  |  Shadcn UI            |    |  POST /api/v1/analysis/{id}  |   |
|  |  TanStack Table v8    |    |  GET  /api/v1/analysis/{id}/ |   |
|  +-----------------------+    |         results              |   |
|                               |                              |   |
|                               |  +------------------------+  |   |
|                               |  |  LangGraph Workflow    |  |   |
|                               |  |  Node A: Extractor     |  |   |
|                               |  |  Node B: Gap Analyzer  |  |   |
|                               |  |  Node C: Bloom Eval.   |  |   |
|                               |  +------------------------+  |   |
|                               |                              |   |
|                               |  +------------------------+  |   |
|                               |  |  PostgreSQL + pgvector |  |   |
|                               |  |  institutions          |  |   |
|                               |  |  programs              |  |   |
|                               |  |  courses               |  |   |
|                               |  |  syllabi  [vec 1536]   |  |   |
|                               |  |  standards[vec + JSONB]|  |   |
|                               |  |  mapping_results       |  |   |
|                               |  +------------------------+  |   |
|                               +------------------------------+   |
+------------------------------------------------------------------+
             ^                             ^
             |                             |
        OpenAI API                 Unstructured.io
  (GPT-4o-mini, embeddings)         (PDF parsing)
```

### Database Entity Relationships

```
Institution (1) --< Program (1) --< Course (1) --< Syllabus
                                                      |
                                              MappingResult >-- Standard
                                              (clo_text,          (framework,
                                               similarity,          code,
                                               blooms_gap,          embedding[1536],
                                               artifact_ref)        meta JSONB)
```

---

## Monorepo Layout

```
Curriculign/
|-- backend/                      # Python FastAPI service
|   |-- app/
|   |   |-- main.py               # FastAPI app, CORS, lifespan hook
|   |   |-- config.py             # Pydantic settings (all env-driven)
|   |   |-- database.py           # SQLModel engine + session factory
|   |   |-- models/               # SQLModel ORM table definitions
|   |   |   |-- institution.py
|   |   |   |-- program.py
|   |   |   |-- course.py
|   |   |   |-- syllabus.py       # pgvector embedding column
|   |   |   |-- standard.py       # pgvector + JSONB columns
|   |   |   `-- mapping_result.py
|   |   |-- schemas/              # Pydantic request/response shapes
|   |   |-- agents/               # LangGraph nodes + compiled workflow
|   |   |   |-- extractor.py      # Node A: CLO extraction
|   |   |   |-- gap_analyzer.py   # Node B: cosine similarity search
|   |   |   |-- evaluator.py      # Node C: Bloom's depth evaluation
|   |   |   `-- workflow.py       # StateGraph wiring + compile
|   |   |-- services/
|   |   |   |-- pdf_ingestion.py  # extract -> chunk -> embed -> store
|   |   |   `-- embeddings.py     # embed_text + similarity_search
|   |   `-- api/routes/
|   |       |-- upload.py         # POST /api/v1/upload/syllabus
|   |       `-- analysis.py       # POST|GET /api/v1/analysis/{id}
|   |-- scripts/
|   |   |-- init_db.sql           # pgvector extension bootstrap
|   |   `-- seed_demo.py          # Seed standards + demo mapping data
|   |-- tests/
|   |   |-- test_ingestion.py
|   |   `-- test_workflow.py
|   |-- requirements.txt
|   `-- Dockerfile
|
|-- frontend/                     # Next.js 14 application
|   |-- src/
|   |   |-- app/
|   |   |   |-- layout.tsx        # Root layout + global navigation
|   |   |   |-- page.tsx          # Marketing landing page
|   |   |   |-- upload/page.tsx   # Syllabus upload interface
|   |   |   `-- dashboard/page.tsx# Curriculum analysis dashboard
|   |   |-- components/
|   |   |   |-- ui/               # Shadcn-style base components
|   |   |   |-- landing/          # Hero, Features, HowItWorks, Frameworks, CTA
|   |   |   |-- upload/           # SyllabusUploader (drag-and-drop)
|   |   |   `-- dashboard/        # MappingTable, CoverageHeatmap, StatsCards
|   |   |-- lib/
|   |   |   |-- utils.ts          # cn() helper
|   |   |   |-- api.ts            # Typed fetch wrappers
|   |   |   `-- demo-data.ts      # Static demo fixtures
|   |   `-- types/
|   |       `-- mapping.ts        # Shared TypeScript interfaces
|   |-- package.json
|   |-- tailwind.config.ts
|   `-- Dockerfile
|
|-- data/
|   |-- synthetic_generator.py    # CLI: compliance-controlled syllabi
|   `-- sample_standards/
|       |-- abet_outcomes.json    # All 7 ABET Student Outcomes
|       |-- wasc_competencies.json# 5 Core Competencies + ILO sample
|       `-- common_core_sample.json
|
|-- docs/
|   |-- architecture.md
|   |-- api-reference.md
|   |-- deployment.md
|   `-- demo-guide.md
|
|-- .env.example
|-- .gitignore
|-- docker-compose.yml
|-- CONTRIBUTING.md
|-- CHANGELOG.md
|-- CODE_OF_CONDUCT.md
`-- README.md
```

---

## Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| Docker + Docker Compose | 24+ |
| Node.js | 20+ |
| Python | 3.11+ |
| OpenAI API Key | any tier |

### 1. Clone and configure

```bash
git clone https://github.com/DaScient/Curriculign.git
cd Curriculign
cp .env.example .env
# Open .env and set your OPENAI_API_KEY
```

### 2. Start the database

```bash
docker compose up db -d
```

### 3. Run the backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Seed the DB with sample standards (ABET, WASC, Common Core)
python scripts/seed_demo.py

# Start the API
uvicorn app.main:app --reload
# API:       http://localhost:8000
# Swagger:   http://localhost:8000/docs
# ReDoc:     http://localhost:8000/redoc
```

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:3000
```

### 5. Or run everything with Docker Compose

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

---

## Running the Demo

No file upload required. Open **http://localhost:3000/dashboard?demo=true** to load a
pre-seeded Civil Engineering syllabus mapped against all 7 ABET Student Outcomes with a
realistic mix of covered, partial, and uncovered outcomes.

### Generate synthetic test syllabi

```bash
cd data

# Perfect alignment
python synthetic_generator.py \
  --subject "Civil Engineering 301" \
  --standard "ABET Outcome 2" \
  --compliance "100% Compliant"

# Planted safety gap
python synthetic_generator.py \
  --subject "Civil Engineering 301" \
  --standard "ABET Outcome 2" \
  --compliance "Missing Safety Factor"

# Shallow Bloom's verbs
python synthetic_generator.py \
  --subject "Civil Engineering 301" \
  --standard "ABET Outcome 2" \
  --compliance "Low Cognitive Depth"
```

Files are saved to `data/output/`. Upload any of them via the UI to see the Gap Analyzer
detect the planted flaw in real time.

See [docs/demo-guide.md](docs/demo-guide.md) for the full demo script.

---

## API Reference

See [docs/api-reference.md](docs/api-reference.md) for the full specification.

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Liveness check |
| POST | /api/v1/upload/syllabus | Upload PDF syllabus (multipart/form-data) |
| POST | /api/v1/analysis/{id}?framework=ABET | Run the full agentic pipeline |
| GET | /api/v1/analysis/{id}/results | Retrieve stored mapping results |

Interactive docs always available at `/docs` (Swagger UI) and `/redoc`.

---

## Supported Frameworks

| Framework | Scope | Killer Feature |
|---|---|---|
| ABET | Engineering accreditation, 7 Student Outcomes | Artifact Locator: flags which assignment evidences each outcome |
| WASC | Regional/institutional accreditation, 5 Core Competencies | Spider-Web: traces CLOs up through PLOs to institutional mission |
| Common Core | K-12 Math + ELA, alphanumeric standard codes | Auto-Tagger: assigns CCSS codes to lesson plans with high accuracy |

Adding a new framework requires only inserting rows into the `standards` table and running
the embedding seed script. Zero backend code changes needed.

---

## Roadmap

### v0.2 — Enhanced Intelligence
- [ ] Multi-standard mapping (one CLO matched to multiple standards simultaneously)
- [ ] Confidence intervals on similarity scores
- [ ] LLM-generated remediation suggestions for gap-flagged CLOs

### v0.3 — Institutional Rollout
- [ ] Multi-tenancy (institution-scoped data isolation)
- [ ] Bulk upload (zip of syllabi routed to parallel pipeline)
- [ ] WASC Spider-Web visualization (PLO to ILO roll-up chart)

### v0.4 — Integrations
- [ ] Canvas LMS integration (auto-import syllabi via OAuth 2.0)
- [ ] Schoology auto-tag push API
- [ ] PDF report generator (accreditation-ready self-study export)

### v1.0 — Enterprise
- [ ] Role-based access (Department Chair, Dean, Accreditation Officer)
- [ ] Audit trail and version history for all mappings
- [ ] SSO via SAML 2.0 / OIDC

---

## Contributing

Contributions of all kinds are welcome: new framework data seeds, improved LangGraph nodes,
UI enhancements, and documentation improvements.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

---

## License

[MIT](LICENSE) (c) 2026 DaScient
