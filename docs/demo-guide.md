# Demo Guide — Step-by-Step Live Walkthrough

This guide walks through a complete Curriculign demo in approximately 8 minutes.
It is designed for product demos to department chairs, accreditation officers,
and engineering deans.

---

## Setup Checklist (before the demo)

- [ ] `docker compose up --build` completed successfully
- [ ] `python scripts/seed_demo.py` ran without errors
- [ ] http://localhost:3000 loads the landing page
- [ ] http://localhost:8000/docs shows the Swagger UI

---

## Act 1 — The Landing Page (1 min)

**URL:** http://localhost:3000

**Talking points:**
- Open with the hero headline: *"Align every course to every standard — automatically."*
- Point to the three framework cards: ABET, WASC, Common Core. Emphasize:
  *"One platform, three entirely different accreditation universes, the same pipeline."*
- Click **View Live Demo** to navigate to the pre-loaded dashboard.
  Say: *"No file upload needed — we already have a Civil Engineering syllabus loaded."*

---

## Act 2 — The Dashboard (Demo Mode, 3 min)

**URL:** http://localhost:3000/dashboard?demo=true

### Stats Cards
- Point out the four summary cards: **7 CLOs extracted**, **4 Covered**, **2 Partial**, **1 Uncovered**.
- Highlight the **coverage score: 71%**. Say: *"An ABET reviewer would immediately see
  this program has a gap. Let me show you exactly where."*

### Coverage Heatmap
- Scroll to the heatmap grid. Each row is a CLO; each column is an ABET Student Outcome.
- Point to the red cell at row 5, column "ABET-SO-4 (Ethics)". Say:
  *"CLO 5 says 'students will list engineering codes.' That's a Remember-level objective.
  ABET Outcome 4 requires Analyze-level ethical reasoning. The AI caught that gap instantly."*
- Point to the green cells. Say: *"Green cells mean covered — the CLO's Bloom's level
  meets or exceeds what the standard demands."*

### Mapping Table
- Scroll to the data grid. Sort by **Coverage Status** to group uncovered rows at the top.
- Click the uncovered row. Show the **Bloom's Level** badges:
  CLO = `Remember`, Standard = `Analyze`. The `gap_flag` icon is lit red.
- Show the **Artifact Reference** column for a covered row:
  *"The AI read the syllabus and identified 'Project 3: Bridge Design' as the
  assignment that evidences ABET Outcome 2. An accreditor can go straight to it."*

---

## Act 3 — Upload + Real-Time Analysis (3 min)

**URL:** http://localhost:3000/upload

### Generate a test syllabus

```bash
cd data
python synthetic_generator.py \
  --subject "Civil Engineering 301" \
  --standard "ABET Outcome 2" \
  --compliance "Missing Safety Factor"
```

A Markdown file appears in `data/output/`. Say:
*"We just asked an AI to write a perfectly normal-looking syllabus — but with
public health, safety, and welfare language deliberately removed. Watch what happens."*

### Upload the file

1. Drag the `.md` file into the upload dropzone.
2. Fill in the form fields (course code, title, institution, program).
3. Click **Upload & Analyze**.

Watch the status badge cycle: `pending → processing → ready`.

### View the results

Click **Go to Dashboard**. The heatmap now shows a red cell on ABET-SO-2 (Engineering Design).

Say: *"The Gap Analyzer found it. The CLO talks about structural systems but never mentions
public health, safety, or welfare. That is an automatic red flag in an ABET review — and
Curriculign surfaces it in under 30 seconds."*

---

## Act 4 — Framework Switch (1 min)

Back on the dashboard, open the **Framework** dropdown and select **WASC**.

Say: *"Same syllabus, different lens. Now we're checking it against WASC's five
Core Competencies — Critical Thinking, Quantitative Reasoning, Written Communication,
Oral Communication, and Information Literacy."*

Show the heatmap re-rendering with a different column structure.

---

## Closing

*"Every accreditation body in the world has the same core problem: someone has to
read every syllabus and manually verify every outcome. Curriculign eliminates that
work — and replaces it with a structured, auditable, AI-generated evidence trail
that any reviewer can trust."*

---

## Troubleshooting Common Demo Issues

| Symptom | Fix |
|---|---|
| Dashboard shows no data | Run `python scripts/seed_demo.py` and refresh |
| Upload returns 500 | Verify `OPENAI_API_KEY` is set in `.env` |
| Heatmap not rendering | Check browser console; ensure `NEXT_PUBLIC_API_URL` points to the running backend |
| `pgvector` error on startup | Ensure you're using `pgvector/pgvector:pg16` image, not plain `postgres` |
