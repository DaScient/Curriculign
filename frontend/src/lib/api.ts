import type { AnalysisResponse, Framework, UploadResponse } from "@/types/mapping";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Upload ────────────────────────────────────────────────────────────────────

export async function uploadSyllabus(
  file: File,
  fields: {
    course_code: string;
    course_title: string;
    institution_name: string;
    program_name: string;
  }
): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("course_code", fields.course_code);
  form.append("course_title", fields.course_title);
  form.append("institution_name", fields.institution_name);
  form.append("program_name", fields.program_name);

  const res = await fetch(`${BASE}/api/v1/upload/syllabus`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Upload failed");
  }
  return res.json();
}

// ── Analysis ──────────────────────────────────────────────────────────────────

export async function runAnalysis(
  syllabusId: string,
  framework: Framework = "ABET"
): Promise<AnalysisResponse> {
  const res = await fetch(
    `${BASE}/api/v1/analysis/${syllabusId}?framework=${framework}`,
    { method: "POST" }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Analysis failed");
  }
  return res.json();
}

export async function getResults(
  syllabusId: string
): Promise<AnalysisResponse> {
  const res = await fetch(`${BASE}/api/v1/analysis/${syllabusId}/results`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Fetch failed");
  }
  return res.json();
}
