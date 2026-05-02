# Architecture — Deep Dive

This document explains the key design decisions behind Curriculign's architecture
and the reasoning that makes each component expandable and replaceable.

---

## 1. Why a Polymorphic Standard Engine?

The three target accreditation frameworks — ABET, WASC, Common Core — have radically
different data shapes:

| Framework | Key Identifier | Metadata Shape |
|---|---|---|
| ABET | `ABET-SO-2` | `includes_safety: bool`, `performance_indicators: []` |
| WASC | `WASC-CC-3` | `competency_type: str`, `nesting_level: int` |
| Common Core | `CCSS.MATH.8.G.A.1` | `subject`, `grade`, `domain`, `cluster` |

A naive approach would create three separate tables — but that means three separate
backend queries, three separate frontend renderers, and a rewrite every time a new
framework is added.

Instead, Curriculign uses a **single `standards` table** with:

- A `framework` VARCHAR discriminator (indexed for fast filtering)
- A `code` VARCHAR for the alphanumeric identifier
- A `description` TEXT for the semantic content that gets embedded
- A `embedding VECTOR(1536)` column (pgvector) for cosine similarity search
- A `meta JSONB` column for all framework-specific attributes

The result: the Gap Analyzer runs the **exact same SQL** regardless of framework.
The frontend reads `meta` to decide which extra columns to render.

---

## 2. Why LangGraph Instead of a Simple LLM Call?

A single "analyze this syllabus" prompt would work — once. LangGraph's StateGraph
architecture gives us:

1. **Modularity**: Each node (Extractor, Gap Analyzer, Evaluator) can be tested,
   replaced, or parallelized independently. Swapping GPT-4o-mini for Claude 3.5
   Sonnet in Node A doesn't touch Nodes B or C.

2. **State persistence**: The `WorkflowState` Pydantic model flows through all
   nodes. Every CLO, every mapping, every Bloom's level is accumulated in one
   typed object — no fragile string parsing between steps.

3. **Conditional routing** (future): LangGraph edges can be conditional. In v0.3
   we will add a retry edge from Node B back to Node A if the extracted CLO count
   is suspiciously low (< 2), triggering a re-extraction with a different prompt.

---

## 3. pgvector Over a Dedicated Vector Database

We chose to extend Postgres with `pgvector` rather than deploying Pinecone, Weaviate,
or Qdrant. The reasons:

- **Transactional integrity**: A mapping result row and its parent standard row live
  in the same ACID transaction. No eventual-consistency surprises.
- **Operational simplicity**: One database to back up, monitor, and scale.
- **SQL familiarity**: The `<=>` cosine distance operator plugs directly into
  SQLModel `select()` queries. No SDK to learn.
- **Good enough performance**: At university scale (< 10,000 standards), an IVFFlat
  or HNSW index on the `embedding` column gives sub-10ms query times.

For very large deployments (millions of standards, e.g., a full K-12 district with
all 2,000+ Common Core codes), a dedicated vector store can be introduced by swapping
only the `similarity_search()` function in `app/services/embeddings.py`.

---

## 4. Ingestion Pipeline Design

```
PDF / Markdown / Text file
         |
         v
_extract_text()          Unstructured.io (hi_res strategy for PDFs)
         |               Falls back to PyPDF2 if Unstructured unavailable
         v
_chunk_text()            RecursiveCharacterTextSplitter
                         chunk_size=512, overlap=64
                         Separators: paragraph > line > sentence > word
         |
         v
embedder.embed_documents()   OpenAI text-embedding-3-small (batch)
         |
         v
_mean_embedding()        Mean-pool all chunk vectors into one 1536-dim vector
         |
         v
syllabus.embedding = vec   Stored in pgvector for document-level search
syllabus.raw_text = text   Stored for Node A (CLO Extractor)
```

The mean-pooled document embedding is used for document-level similarity (e.g.,
"which standards is this course generally about?"). The raw text is passed to the
LLM for precise CLO extraction.

---

## 5. Bloom's Taxonomy Depth Analysis (Node C)

Bloom's Taxonomy classifies cognitive demand into six ordered levels:

```
Remember < Understand < Apply < Analyze < Evaluate < Create
```

Node C instructs the LLM to classify both the CLO and the matched Standard at one
of these six levels. A `gap_flag = True` is set when:

```
BLOOMS_ORDER[clo_level] < BLOOMS_ORDER[standard_level]
```

This catches the most common ABET failure mode: a CLO that says "students will
**define** a structural system" (Remember) when ABET Outcome 2 requires them to
**design** one (Create/Evaluate).

The Artifact Locator (also in Node C) asks the LLM to quote any assignment, project,
or exam from the syllabus text that evidences the CLO. ABET reviewers require this
evidence trail — the Artifact Locator automates it.

---

## 6. Frontend Architecture

The Next.js 14 App Router is organized into three experiences:

| Route | Purpose |
|---|---|
| `/` | Marketing landing page — product value proposition, framework overview, CTA |
| `/upload` | Syllabus upload — drag-and-drop, form fields, ingestion status polling |
| `/dashboard` | Analysis dashboard — stats, heatmap, data grid; `?demo=true` for fixture data |

The `lib/demo-data.ts` module provides static fixture data for the demo mode,
allowing the entire frontend to function without a running backend or API key.

The `lib/api.ts` module wraps all `fetch` calls with typed request/response shapes
that mirror the Pydantic schemas in the backend, ensuring end-to-end type safety.
