import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Educator Resources — Curriculign",
  description:
    "A growing library of guides, templates, and references for teachers, faculty, and curriculum designers using Curriculign.",
};

/**
 * Resources hub
 * -------------
 * Minimal, academic landing page for teacher / faculty resources.
 * Each entry is intentionally a self-contained card so future content
 * (guides, templates, webinars, etc.) can be appended without
 * reshuffling the layout.
 *
 * Status conventions:
 *   - "available": the resource exists today; `href` should be set.
 *   - "draft":     the resource is being written; no link.
 *   - "planned":   placeholder for a future enrichment.
 */
type ResourceStatus = "available" | "draft" | "planned";

interface Resource {
  title: string;
  summary: string;
  href?: string;
  status: ResourceStatus;
  tag?: string;
}

const SECTIONS: { heading: string; intro: string; items: Resource[] }[] = [
  {
    heading: "Get started",
    intro:
      "Short, opinionated walkthroughs to take a syllabus from upload to accreditation-ready in under an hour.",
    items: [
      {
        title: "Quickstart: Your first alignment",
        summary:
          "Upload a sample syllabus, run the AI pipeline, and read the resulting heatmap end-to-end.",
        href: "/upload",
        tag: "5 min",
        status: "available",
      },
      {
        title: "Live demo dataset",
        summary:
          "Walk through a fully populated dashboard for a Civil Engineering course — no upload required.",
        href: "/dashboard?demo=true",
        tag: "Demo",
        status: "available",
      },
      {
        title: "Architecture overview",
        summary:
          "How the polymorphic Standard engine, LangGraph agents, and pgvector index fit together.",
        href: "https://github.com/DaScient/Curriculign/blob/main/docs/architecture.md",
        tag: "Reference",
        status: "available",
      },
    ],
  },
  {
    heading: "Guides & references",
    intro:
      "Practical writing aids and reference material for outcome design, assessment, and self-study reports.",
    items: [
      {
        title: "Writing measurable CLOs",
        summary:
          "Verb selection, Bloom's depth, and observability — with before-and-after examples.",
        status: "draft",
      },
      {
        title: "ABET Student Outcomes 1–7, plain-English",
        summary:
          "What each outcome actually asks of a course, and what evidence reviewers look for.",
        status: "draft",
      },
      {
        title: "WASC Core Competencies primer",
        summary:
          "A short orientation to the five competencies and how they roll up from CLO → PLO → ILO.",
        status: "planned",
      },
      {
        title: "Common Core tagging cheat-sheet",
        summary:
          "How CCSS alphanumeric codes are structured, and how Curriculign assigns them automatically.",
        status: "planned",
      },
    ],
  },
  {
    heading: "Templates",
    intro:
      "Drop-in starting points for the documents teachers and faculty produce most often.",
    items: [
      {
        title: "Syllabus skeleton (PDF / Markdown)",
        summary:
          "An outline that already contains every section reviewers expect — fill in and upload.",
        status: "planned",
      },
      {
        title: "Outcome-aligned rubric template",
        summary:
          "Four-level rubric scaffold with sample descriptors keyed to Bloom's levels.",
        status: "planned",
      },
      {
        title: "Self-study narrative blocks",
        summary:
          "Reusable paragraph patterns for accreditation reports, generated from your mappings.",
        status: "planned",
      },
    ],
  },
  {
    heading: "Community & support",
    intro:
      "Curriculign is open-source and built in the open. Help shape what we work on next.",
    items: [
      {
        title: "GitHub repository",
        summary:
          "Browse the code, file an issue, or open a discussion. Contributions of every size are welcome.",
        href: "https://github.com/DaScient/Curriculign",
        tag: "Open source",
        status: "available",
      },
      {
        title: "Suggest a feature",
        summary:
          "Tell us about a workflow we should automate next. Educator requests are prioritized.",
        href: "https://github.com/DaScient/Curriculign/issues/new?labels=enhancement&title=Resource%20request",
        tag: "Roadmap",
        status: "available",
      },
      {
        title: "Educator office hours",
        summary:
          "Monthly drop-in sessions for faculty and teachers — bring a syllabus, leave with a plan.",
        status: "planned",
      },
    ],
  },
];

function StatusPill({ status, tag }: { status: ResourceStatus; tag?: string }) {
  if (tag && status === "available") {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
        {tag}
      </span>
    );
  }
  const label =
    status === "available" ? "Available" : status === "draft" ? "In draft" : "Planned";
  const styles =
    status === "available"
      ? "bg-emerald-100 text-emerald-800"
      : status === "draft"
      ? "bg-amber-100 text-amber-800"
      : "bg-slate-200 text-slate-600";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${styles}`}
    >
      {label}
    </span>
  );
}

export default function ResourcesPage() {
  return (
    <div className="bg-slate-50">
      {/* ── Page header ───────────────────────────────────────────── */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            For educators
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Resources Library
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            A small, deliberately curated collection of guides, templates,
            and references — written for teachers, faculty, and curriculum
            designers. Everything below is free to use and built on open
            standards.
          </p>
        </div>
      </header>

      {/* ── Sections ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl space-y-16 px-6 py-16">
        {SECTIONS.map((section) => (
          <section key={section.heading}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {section.heading}
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600">{section.intro}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {section.items.map((item) => {
                const isLink = item.status === "available" && !!item.href;
                const isExternal = isLink && item.href!.startsWith("http");
                const cardInner = (
                  <Card
                    className={`h-full border ${
                      isLink
                        ? "border-slate-200 transition group-hover:-translate-y-0.5 group-hover:border-blue-300 group-hover:shadow-md"
                        : "border-dashed border-slate-200 bg-white/60"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex items-center justify-between">
                        <StatusPill status={item.status} tag={item.tag} />
                        {isLink && (
                          <span className="text-slate-400 transition group-hover:text-blue-500">
                            {isExternal ? "↗" : "→"}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg text-slate-900">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {item.summary}
                      </p>
                    </CardContent>
                  </Card>
                );

                if (isLink && isExternal) {
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      {cardInner}
                    </a>
                  );
                }
                if (isLink) {
                  return (
                    <Link key={item.title} href={item.href!} className="group block">
                      {cardInner}
                    </Link>
                  );
                }
                return (
                  <div key={item.title} className="block">
                    {cardInner}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* ── Forward-looking note ────────────────────────────────── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            More on the way
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
            This library grows as the platform does. New guides, templates,
            and automated tools are added with each release —{" "}
            <a
              href="https://github.com/DaScient/Curriculign/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline-offset-4 hover:underline"
            >
              follow the changelog ↗
            </a>{" "}
            to stay current.
          </p>
        </section>
      </div>
    </div>
  );
}
