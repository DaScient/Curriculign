# Deployment Guide

This document covers deploying Curriculign in development, staging, and production
configurations.

---

## Environment Variables

All runtime configuration is driven by environment variables. Copy `.env.example`
and fill in real values:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | ✅ | — | OpenAI API key (any tier) |
| `DATABASE_URL` | ✅ | `postgresql://curriculign:curriculign@localhost:5432/curriculign` | Postgres connection string |
| `OPENAI_MODEL` | | `gpt-4o-mini` | Chat completion model for Nodes A + C |
| `EMBEDDING_MODEL` | | `text-embedding-3-small` | Embedding model for Node B |
| `DEBUG` | | `false` | Enables SQLAlchemy echo and verbose logging |
| `UPLOAD_DIR` | | `/tmp/curriculign_uploads` | Local path for uploaded files |
| `MAX_UPLOAD_SIZE_MB` | | `20` | Maximum file size |
| `CHUNK_SIZE` | | `512` | Text splitter chunk size (tokens) |
| `CHUNK_OVERLAP` | | `64` | Text splitter overlap (tokens) |
| `NEXT_PUBLIC_API_URL` | | `http://localhost:8000` | Backend URL visible to the browser |

---

## Local Development (no Docker)

### 1. Start Postgres with pgvector

```bash
docker compose up db -d
```

### 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/seed_demo.py
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

---

## Docker Compose (recommended for staging)

```bash
cp .env.example .env   # set OPENAI_API_KEY
docker compose up --build
```

Services started:

| Service | Internal port | Exposed port |
|---|---|---|
| `db` (pgvector/pgvector:pg16) | 5432 | 5432 |
| `backend` (FastAPI + uvicorn) | 8000 | 8000 |
| `frontend` (Next.js) | 3000 | 3000 |

Data persists in the named `pgdata` Docker volume across restarts.

### Seed the database after first start

```bash
docker compose exec backend python scripts/seed_demo.py
```

---

## Production Considerations

### Database

- Use a managed Postgres service (e.g. **Supabase**, **Neon**, **AWS RDS**) with
  the `pgvector` extension enabled.
- Set `DATABASE_URL` to the managed service connection string.
- The `init_db.sql` script is run automatically on first container start via
  Docker's `docker-entrypoint-initdb.d/` mechanism.

### Backend

- Replace `uvicorn ... --reload` with:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
  ```
- Use a reverse proxy (nginx or a cloud load balancer) in front of uvicorn.
- Store uploaded files in cloud object storage (S3 / GCS) rather than
  `/tmp/`; swap `_ensure_upload_dir()` in `api/routes/upload.py`.
- Set `DEBUG=false`.

### Frontend

```bash
cd frontend
npm run build
npm start
```

Or deploy the `frontend/` directory directly to **Vercel** (zero config,
just set `NEXT_PUBLIC_API_URL` in the Vercel project environment variables).

### CORS

Update `allow_origins` in `backend/app/main.py` to include your production
frontend domain before deploying.

### Secret management

Never commit `.env` files. Use your platform's secret manager
(AWS Secrets Manager, Vercel Environment Variables, Docker Swarm secrets, etc.)
to inject `OPENAI_API_KEY` and `DATABASE_URL` at runtime.
