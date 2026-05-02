# Contributing to Curriculign

Thank you for your interest in contributing! Curriculign is built in the open and every
improvement — from a typo fix to a new accreditation framework — is valued.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Development Environment](#development-environment)
3. [Branch & Commit Conventions](#branch--commit-conventions)
4. [How to Add a New Accreditation Framework](#how-to-add-a-new-accreditation-framework)
5. [Running the Test Suite](#running-the-test-suite)
6. [Submitting a Pull Request](#submitting-a-pull-request)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).
By participating you agree to abide by its terms.

---

## Development Environment

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env        # add OPENAI_API_KEY
docker compose up db -d           # start Postgres + pgvector
python scripts/seed_demo.py       # seed standards
uvicorn app.main:app --reload     # http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev                        # http://localhost:3000
```

### Linting & formatting

```bash
# Python
cd backend && ruff check . && ruff format --check .

# TypeScript / Next.js
cd frontend && npm run lint
```

---

## Branch & Commit Conventions

| Pattern | Purpose |
|---|---|
| `feat/<description>` | New feature |
| `fix/<description>` | Bug fix |
| `docs/<description>` | Documentation only |
| `data/<framework>` | New framework seed data |
| `chore/<description>` | Tooling, CI, dependencies |

Commit messages follow **Conventional Commits**:

```
feat(agents): add confidence interval to similarity scores
fix(upload): handle empty PDF gracefully
docs(readme): add WASC deployment example
data(abet): add Performance Indicators for Outcome 3
```

---

## How to Add a New Accreditation Framework

The Polymorphic Standard Engine is designed so that adding a framework requires
**zero backend code changes**. Follow these steps:

### 1. Create the seed JSON

Add a file to `data/sample_standards/<framework_name>.json`:

```json
[
  {
    "framework": "MY_FRAMEWORK",
    "code": "MF-1",
    "title": "Standard Title",
    "description": "Full description used for semantic search embedding.",
    "level": "Standard",
    "parent_code": null,
    "meta": {
      "any_extra_key": "any_value"
    }
  }
]
```

The `description` field is what gets embedded — make it rich and precise.
The `meta` JSONB field holds any framework-specific data (codes, levels, flags).

### 2. Run the embedding seed

```bash
cd backend
python scripts/seed_demo.py --framework MY_FRAMEWORK
```

This inserts the standards into Postgres and generates their vector embeddings.

### 3. Test it

```bash
# Upload a test syllabus and target your new framework
curl -X POST http://localhost:8000/api/v1/analysis/<syllabus_id>?framework=MY_FRAMEWORK
```

The full pipeline — Gap Analyzer, Bloom Evaluator, Dashboard — adapts automatically.

---

## Running the Test Suite

```bash
cd backend
pytest tests/ -v
```

Tests use `pytest` with `pytest-asyncio` for async endpoint tests.
A running Postgres instance is required (or use the Docker Compose `db` service).

---

## Submitting a Pull Request

1. Fork the repository and create a branch from `main`.
2. Make your changes, add or update tests as appropriate.
3. Ensure `pytest` and `npm run lint` both pass.
4. Open a pull request with a clear description of the change and its motivation.
5. A maintainer will review and merge within 2–5 business days.

---

## License

By contributing you agree that your contributions will be licensed under the
[MIT License](LICENSE).
