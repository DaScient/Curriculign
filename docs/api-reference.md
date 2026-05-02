# API Reference

Base URL: `http://localhost:8000` (development) or your deployed backend host.

All responses are JSON. Error responses follow the FastAPI default shape:
`{ "detail": "<message>" }`.

---

## Health

### GET /health

Liveness check. Returns immediately; useful for load-balancer probes.

**Response 200**
```json
{ "status": "ok", "version": "0.1.0" }
```

---

## Upload

### POST /api/v1/upload/syllabus

Upload a syllabus file and trigger the ingestion pipeline
(extract → chunk → embed → store).

**Content-Type:** `multipart/form-data`

**Form fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | PDF, `.txt`, or `.md` — max 20 MB |
| `course_code` | string | ✅ | e.g. `CE-301` |
| `course_title` | string | ✅ | e.g. `Structural Analysis` |
| `institution_name` | string | ✅ | e.g. `State University` |
| `program_name` | string | ✅ | e.g. `Civil Engineering BS` |

**Response 201**
```json
{
  "syllabus_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "course_id":   "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "filename":    "CE301_Fall2024.pdf",
  "status":      "ready",
  "message":     "Ingestion complete."
}
```

**Possible status values**

| Status | Meaning |
|---|---|
| `pending` | Record created, ingestion not yet started |
| `processing` | Text extraction + embedding in progress |
| `ready` | Ingestion complete — analysis can be triggered |
| `error` | Ingestion failed — `raw_text` contains the error message |

**Error responses**

| Code | Condition |
|---|---|
| 400 | No filename provided |
| 413 | File exceeds 20 MB |
| 415 | Unsupported file type |

---

## Analysis

### POST /api/v1/analysis/{syllabus_id}

Trigger the full three-node LangGraph pipeline for a syllabus that is in `ready`
status. Returns the complete structured mapping JSON.

**Path parameter:** `syllabus_id` (UUID)

**Query parameter:** `framework` — one of `ABET` | `WASC` | `COMMON_CORE`
(default: `ABET`)

**Response 200**
```json
{
  "syllabus_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "course_code": "CE-301",
  "course_title": "Structural Analysis",
  "framework": "ABET",
  "total_clos": 7,
  "total_standards": 7,
  "covered_count": 4,
  "partial_count": 2,
  "uncovered_count": 1,
  "mappings": [
    {
      "id": "...",
      "clo_text": "Design a structural system considering public health and safety constraints.",
      "standard": {
        "id": "...",
        "framework": "ABET",
        "code": "ABET-SO-2",
        "title": "Engineering Design",
        "description": "An ability to apply engineering design..."
      },
      "similarity_score": 0.8921,
      "blooms_level_clo": "Create",
      "blooms_level_standard": "Evaluate",
      "gap_flag": false,
      "artifact_reference": "Project 3: Bridge Design with Safety Analysis",
      "coverage_status": "covered",
      "detail": {
        "reasoning": "CLO uses 'Design' (Create level) which meets or exceeds the Evaluate-level standard."
      }
    }
  ]
}
```

**Error responses**

| Code | Condition |
|---|---|
| 404 | Syllabus not found |
| 422 | Syllabus status is not `ready` |

---

### GET /api/v1/analysis/{syllabus_id}/results

Retrieve previously computed mapping results without re-running the pipeline.

**Path parameter:** `syllabus_id` (UUID)

**Response 200** — same schema as the POST endpoint above.

**Error responses**

| Code | Condition |
|---|---|
| 404 | Syllabus not found, or no results have been computed yet |

---

## Interactive Documentation

The FastAPI application automatically generates and serves interactive docs:

| URL | Tool |
|---|---|
| `/docs` | Swagger UI — try any endpoint directly in the browser |
| `/redoc` | ReDoc — clean reference format |
| `/openapi.json` | Raw OpenAPI 3.1 schema |
