/**
 * Static fixture data for demo mode (?demo=true).
 * Mirrors the AnalysisResponse shape exactly — no API call required.
 */
import type { AnalysisResponse } from "@/types/mapping";

export const DEMO_SYLLABUS_ID = "00000000-0000-0000-0000-000000000001";

export const DEMO_DATA: AnalysisResponse = {
  syllabus_id: DEMO_SYLLABUS_ID,
  course_code: "CE-301",
  course_title: "Structural Analysis",
  framework: "ABET",
  total_clos: 7,
  total_standards: 7,
  covered_count: 4,
  partial_count: 2,
  uncovered_count: 1,
  mappings: [
    {
      id: "m1",
      clo_text:
        "Apply the principles of static equilibrium and compatibility to analyze determinate and indeterminate structural systems under various load conditions.",
      standard: {
        id: "s1",
        framework: "ABET",
        code: "ABET-SO-1",
        title: "Engineering Knowledge",
        description:
          "An ability to identify, formulate, and solve complex engineering problems by applying principles of engineering, science, and mathematics.",
      },
      similarity_score: 0.8934,
      blooms_level_clo: "Apply",
      blooms_level_standard: "Apply",
      gap_flag: false,
      artifact_reference: "Homework sets 1–7; Midterm Examination",
      coverage_status: "covered",
      detail: {
        reasoning: "CLO uses 'Apply' matching the standard's expected level.",
      },
    },
    {
      id: "m2",
      clo_text:
        "Design structural members (beams, columns, trusses) that satisfy strength, stiffness, and stability criteria while considering public health, safety, welfare, and environmental factors.",
      standard: {
        id: "s2",
        framework: "ABET",
        code: "ABET-SO-2",
        title: "Engineering Design",
        description:
          "An ability to apply engineering design to produce solutions that meet specified needs with consideration of public health, safety, and welfare, as well as global, cultural, social, environmental, and economic factors.",
      },
      similarity_score: 0.921,
      blooms_level_clo: "Create",
      blooms_level_standard: "Evaluate",
      gap_flag: false,
      artifact_reference: "Project 3: Bridge Design with Safety Analysis (Week 14)",
      coverage_status: "covered",
      detail: {
        reasoning:
          "Explicitly addresses safety/welfare/environmental factors; 'Design' is Create level.",
      },
    },
    {
      id: "m3",
      clo_text:
        "Evaluate the structural integrity of existing infrastructure using analytical methods and engineering judgment, communicating findings to both technical and non-technical audiences.",
      standard: {
        id: "s3",
        framework: "ABET",
        code: "ABET-SO-3",
        title: "Communication",
        description:
          "An ability to communicate effectively with a range of audiences.",
      },
      similarity_score: 0.7812,
      blooms_level_clo: "Evaluate",
      blooms_level_standard: "Apply",
      gap_flag: false,
      artifact_reference: "Project 3 Presentation (Week 14)",
      coverage_status: "covered",
      detail: {
        reasoning: "Communication to varied audiences directly satisfies SO-3.",
      },
    },
    {
      id: "m4",
      clo_text:
        "Conduct laboratory experiments and interpret displacement/strain data to validate theoretical structural models.",
      standard: {
        id: "s6",
        framework: "ABET",
        code: "ABET-SO-6",
        title: "Experimentation",
        description:
          "An ability to develop and conduct appropriate experimentation, analyze and interpret data, and use engineering judgment to draw conclusions.",
      },
      similarity_score: 0.8651,
      blooms_level_clo: "Analyze",
      blooms_level_standard: "Analyze",
      gap_flag: false,
      artifact_reference: "Lab reports (weeks 6, 9, 12)",
      coverage_status: "covered",
      detail: {
        reasoning: "Experimentation + data interpretation directly maps to SO-6.",
      },
    },
    {
      id: "m5",
      clo_text:
        "List the major provisions of ASCE 7 load combinations and identify applicable load cases for standard building configurations.",
      standard: {
        id: "s4",
        framework: "ABET",
        code: "ABET-SO-4",
        title: "Ethics",
        description:
          "An ability to recognize ethical and professional responsibilities in engineering situations and make informed judgments.",
      },
      similarity_score: 0.5823,
      blooms_level_clo: "Remember",
      blooms_level_standard: "Analyze",
      gap_flag: true,
      artifact_reference: null,
      coverage_status: "partial",
      detail: {
        reasoning:
          "'List' and 'identify' are Remember-level verbs; SO-4 requires Analyze-level ethical reasoning.",
      },
    },
    {
      id: "m6",
      clo_text:
        "Work effectively in multidisciplinary teams to complete a semester-long bridge design project that addresses cultural, economic, and societal constraints.",
      standard: {
        id: "s5",
        framework: "ABET",
        code: "ABET-SO-5",
        title: "Teamwork",
        description:
          "An ability to function effectively on a team whose members together provide leadership, create a collaborative and inclusive environment.",
      },
      similarity_score: 0.8201,
      blooms_level_clo: "Apply",
      blooms_level_standard: "Apply",
      gap_flag: false,
      artifact_reference: "Project 3: Bridge Design (team component, Week 14)",
      coverage_status: "covered",
      detail: {
        reasoning:
          "Team project with cross-domain constraints satisfies SO-5.",
      },
    },
    {
      id: "m7",
      clo_text:
        "Demonstrate awareness of professional and ethical responsibilities by citing relevant engineering codes (ACI 318, AISC 360) in design decisions.",
      standard: {
        id: "s7",
        framework: "ABET",
        code: "ABET-SO-7",
        title: "Lifelong Learning",
        description:
          "An ability to acquire and apply new knowledge as needed, using appropriate learning strategies.",
      },
      similarity_score: 0.4901,
      blooms_level_clo: "Understand",
      blooms_level_standard: "Apply",
      gap_flag: true,
      artifact_reference: null,
      coverage_status: "uncovered",
      detail: {
        reasoning:
          "'Demonstrate awareness' is Understand level; SO-7 (Lifelong Learning) requires Apply-level self-directed strategy.",
      },
    },
  ],
};
