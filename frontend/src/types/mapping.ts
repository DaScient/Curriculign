// Shared TypeScript interfaces — mirrors backend Pydantic schemas exactly.

export type CoverageStatus = "covered" | "partial" | "uncovered";

export type BloomsLevel =
  | "Remember"
  | "Understand"
  | "Apply"
  | "Analyze"
  | "Evaluate"
  | "Create";

export type Framework = "ABET" | "WASC" | "COMMON_CORE";

export interface StandardRef {
  id: string;
  framework: Framework;
  code: string;
  title: string;
  description: string;
}

export interface MappingRow {
  id: string;
  clo_text: string;
  standard: StandardRef;
  similarity_score: number;
  blooms_level_clo: BloomsLevel | null;
  blooms_level_standard: BloomsLevel | null;
  gap_flag: boolean;
  artifact_reference: string | null;
  coverage_status: CoverageStatus;
  detail: { reasoning?: string } | null;
}

export interface AnalysisResponse {
  syllabus_id: string;
  course_code: string | null;
  course_title: string | null;
  framework: Framework;
  total_clos: number;
  total_standards: number;
  covered_count: number;
  partial_count: number;
  uncovered_count: number;
  mappings: MappingRow[];
}

export interface UploadResponse {
  syllabus_id: string;
  course_id: string;
  filename: string;
  status: string;
  message: string;
}
