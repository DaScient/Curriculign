import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Educator Toolkit
 * ----------------
 * A faculty-facing index of features that are live today plus
 * clearly-labelled placeholders for forthcoming enrichments.
 *
 * To add a future tool: append an entry below with `status: "planned"`.
 * When the tool ships, flip its `status` to `"live"` and (optionally)
 * point `href` at the new route. Anything else on the page will adjust
 * automatically — no other edits required.
 */
type ToolStatus = "live" | "planned";

interface Tool {
  title: string;
  summary: string;
  href?: string;
  status: ToolStatus;
}

const TOOLKIT: Tool[] = [
  // ── Live today ────────────────────────────────────────────────────
  {
    title: "Syllabus Aligner",
    summary:
      "Upload a syllabus and receive an accreditation-ready CLO-to-standard map in minutes.",
    href: "/upload",
    status: "live",
  },
  {
    title: "Curriculum Dashboard",
    summary:
      "Coverage heatmaps, gap flags, and Bloom's depth — sortable, filterable, exportable.",
    href: "/dashboard?demo=true",
    status: "live",
  },

  // ── Coming soon (placeholders for future enrichments) ─────────────
  {
    title: "Lesson Plan Builder",
    summary:
      "Compose standards-aligned lesson plans from a guided template; export to PDF or LMS.",
    status: "planned",
  },
  {
    title: "Rubric Generator",
    summary:
      "Turn any learning outcome into a transparent, point-weighted rubric students can read.",
    status: "planned",
  },
  {
    title: "Standards Library",
    summary:
      "Browseable catalogue of ABET, WASC, Common Core, NGSS, and state frameworks in one place.",
    status: "planned",
  },
  {
    title: "Assessment Bank",
    summary:
      "Curated, peer-reviewed prompts and questions tagged by outcome, depth, and difficulty.",
    status: "planned",
  },
  {
    title: "Office-Hours Scheduler",
    summary:
      "Lightweight booking page tied to your course roster — no third-party calendar required.",
    status: "planned",
  },
  {
    title: "Accreditation Self-Study",
    summary:
      "Auto-draft narrative sections from existing mappings; reviewers can comment inline.",
    status: "planned",
  },
];

export default function EducatorToolkit() {
  return (
    <section id="toolkit" className="mt-12">
      <div className="glass-pane px-6 py-16 sm:py-20">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
            For Teachers, Faculty &amp; Curriculum Designers
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            The Educator Toolkit
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Practical, classroom-tested utilities that quietly do the
            administrative work — so you can spend more time teaching.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLKIT.map((tool) => {
            const isLive = tool.status === "live";
            const Wrapper: React.ElementType =
              isLive && tool.href ? Link : "div";
            const wrapperProps =
              isLive && tool.href ? { href: tool.href } : {};

            return (
              <Wrapper
                key={tool.title}
                {...wrapperProps}
                className={
                  isLive ? "group block" : "block"
                }
              >
                <Card
                  className={
                    isLive
                      ? "glass-card gentle-lift h-full"
                      : "h-full rounded-xl border border-dashed border-slate-300/70 bg-white/40 backdrop-blur-md"
                  }
                >
                  <CardHeader className="pb-2">
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                          isLive
                            ? "bg-emerald-100/80 text-emerald-700"
                            : "bg-slate-100/80 text-slate-500"
                        }`}
                      >
                        {isLive ? "Available" : "Coming soon"}
                      </span>
                      {isLive && (
                        <span className="text-slate-400 transition-colors duration-200 group-hover:text-indigo-500">
                          →
                        </span>
                      )}
                    </div>
                    <CardTitle
                      className={`text-base ${
                        isLive ? "text-slate-900" : "text-slate-600"
                      }`}
                    >
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {tool.summary}
                    </p>
                  </CardContent>
                </Card>
              </Wrapper>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Have a tool you wish existed?{" "}
          <a
            href="https://github.com/DaScient/Curriculign/issues/new?labels=enhancement&title=Toolkit%20request"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline"
          >
            Suggest one on GitHub ↗
          </a>
        </p>
      </div>
    </section>
  );
}
