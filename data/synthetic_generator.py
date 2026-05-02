#!/usr/bin/env python3
"""
Synthetic Syllabus Generator
=============================
CLI tool that generates realistic university syllabi as Markdown files
using the OpenAI API (or any OpenAI-compatible endpoint).

Usage
-----
  python synthetic_generator.py \\
      --subject "Civil Engineering 301" \\
      --standard "ABET Outcome 2" \\
      --compliance "Missing Safety Factor" \\
      --out ./output

Compliance levels
-----------------
  100% Compliant        – perfect alignment with the target standard
  Missing Safety Factor – omits public health / safety / welfare language
  Low Cognitive Depth   – replaces higher-order verbs (design, evaluate) with
                          lower-order ones (define, list, recall)
"""
from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("openai package not found. Run: pip install openai", file=sys.stderr)
    sys.exit(1)

# ── Prompt templates ──────────────────────────────────────────────────────────

_BASE_SYSTEM = """You are an expert university curriculum designer.
Your task is to generate a fully structured, realistic university course syllabus in Markdown format.

The syllabus MUST include ALL of the following sections:
1. Course Title & Code
2. Instructor Information (fictional)
3. Course Description (2–3 sentences)
4. Prerequisites
5. Course Learning Outcomes (CLOs) – a numbered list of at least 6 outcomes
6. Required Textbooks
7. Weekly Schedule (14-week table with topic and activities)
8. Grading Breakdown
9. Course Policies (attendance, academic integrity)
"""

_COMPLIANCE_INSTRUCTIONS = {
    "100% Compliant": (
        "The CLOs must directly and explicitly address every requirement of the target standard. "
        "Use precise, high-cognitive-depth action verbs (Design, Evaluate, Analyze, Create, Synthesize). "
        "For ABET Outcome 2, at least two CLOs must mention public health, safety, welfare, AND "
        "global/cultural/social/environmental/economic factors."
    ),
    "Missing Safety Factor": (
        "The CLOs should appear thorough and well-written, but must NOT contain any mention of: "
        "public health, safety, welfare, societal impact, or ethical constraints. "
        "The rest of the syllabus (description, schedule, policies) should look completely normal "
        "so the omission is subtle and non-obvious."
    ),
    "Low Cognitive Depth": (
        "Replace all high-order Bloom's Taxonomy verbs (Design, Evaluate, Analyze, Synthesize, Create) "
        "in the CLOs with low-order verbs (Define, List, Recall, Identify, Describe, State). "
        "The CLO topics should still match the standard's subject matter, but the cognitive demand "
        "must be kept at Remember/Understand level throughout."
    ),
}


def _build_prompt(subject: str, standard: str, compliance: str) -> str:
    compliance_note = _COMPLIANCE_INSTRUCTIONS.get(
        compliance,
        _COMPLIANCE_INSTRUCTIONS["100% Compliant"],
    )
    return (
        f"Generate a complete university syllabus for:\n"
        f"  Course Subject : {subject}\n"
        f"  Target Standard: {standard}\n\n"
        f"Compliance instructions:\n{compliance_note}\n\n"
        f"Output ONLY the Markdown syllabus, no preamble or explanation."
    )


def _safe_filename(text: str) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", text).strip()
    return re.sub(r"[\s]+", "_", cleaned)[:60]


def generate_syllabus(
    subject: str,
    standard: str,
    compliance: str,
    model: str = "gpt-4o-mini",
    api_key: str | None = None,
) -> str:
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model=model,
        temperature=0.7,
        messages=[
            {"role": "system", "content": _BASE_SYSTEM},
            {"role": "user", "content": _build_prompt(subject, standard, compliance)},
        ],
    )
    return response.choices[0].message.content or ""


def save_syllabus(content: str, subject: str, compliance: str, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{_safe_filename(subject)}_{_safe_filename(compliance)}_{timestamp}.md"
    out_path = out_dir / filename
    out_path.write_text(content, encoding="utf-8")
    return out_path


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate synthetic university syllabi for compliance testing.",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "--subject",
        required=True,
        help='Course subject, e.g. "Civil Engineering 301"',
    )
    parser.add_argument(
        "--standard",
        required=True,
        help='Target standard, e.g. "ABET Outcome 2"',
    )
    parser.add_argument(
        "--compliance",
        choices=["100% Compliant", "Missing Safety Factor", "Low Cognitive Depth"],
        default="100% Compliant",
        help="Compliance level of the generated syllabus (default: 100%% Compliant)",
    )
    parser.add_argument(
        "--out",
        default="./output",
        help="Output directory for generated Markdown files (default: ./output)",
    )
    parser.add_argument(
        "--model",
        default="gpt-4o-mini",
        help="OpenAI model to use (default: gpt-4o-mini)",
    )
    parser.add_argument(
        "--api-key",
        default=None,
        help="OpenAI API key (falls back to OPENAI_API_KEY env var)",
    )
    args = parser.parse_args()

    print(f"Generating syllabus for '{args.subject}' targeting '{args.standard}' …")
    print(f"  Compliance level : {args.compliance}")
    print(f"  Model            : {args.model}")

    content = generate_syllabus(
        subject=args.subject,
        standard=args.standard,
        compliance=args.compliance,
        model=args.model,
        api_key=args.api_key,
    )

    out_path = save_syllabus(content, args.subject, args.compliance, Path(args.out))
    print(f"\n✓ Syllabus saved to: {out_path}")


if __name__ == "__main__":
    main()
