import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: "🎯",
    title: "ABET Precision Engine",
    subtitle: "For Engineering Programs",
    description:
      "The Gap Analyzer checks not just that a CLO mentions 'design' — it verifies the full context: public health, safety, welfare, and socio-environmental constraints. The Artifact Locator then cites the exact assignment that evidences each of the 7 Student Outcomes.",
    highlights: ["7 Student Outcomes", "Performance Indicators", "Artifact Locator"],
    accent: "from-sky-300/70 to-indigo-300/70",
  },
  {
    icon: "🕸️",
    title: "WASC Institutional Aligner",
    subtitle: "For Regional Accreditation",
    description:
      "Maps the full Russian nesting-doll hierarchy: CLO → PLO → ILO. Validates that a Freshman History class rolls up to the university's ILO for Global Citizenship. Visualize Core Competency coverage across a 4-year degree in one heatmap.",
    highlights: ["5 Core Competencies", "Hierarchical roll-up", "Mission alignment"],
    accent: "from-violet-300/70 to-fuchsia-300/70",
  },
  {
    icon: "🏷️",
    title: "Common Core Auto-Tagger",
    subtitle: "For K-12 Districts",
    description:
      "Teachers submit lesson plans or worksheets and the agent instantly assigns the exact CCSS alphanumeric code — no more manual LMS tagging. Administrators get a district-wide view of standard coverage before state testing season.",
    highlights: ["Math + ELA standards", "Alphanumeric codes", "LMS-ready output"],
    accent: "from-emerald-300/70 to-teal-300/70",
  },
];

export default function Features() {
  return (
    <section className="mt-12">
      <div className="glass-pane px-6 py-16 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            One Platform. Every Framework.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            The Polymorphic Standard Engine adapts to any accreditation body — without
            a single line of backend code change.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="glass-card gentle-lift overflow-hidden">
              <div className={`h-1 w-full bg-gradient-to-r ${f.accent}`} />
              <CardHeader className="pb-2">
                <div className="mb-2 text-3xl" aria-hidden="true">{f.icon}</div>
                <CardTitle className="text-lg text-slate-900">{f.title}</CardTitle>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{f.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-600">{f.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {f.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-slate-700">
                      <span aria-hidden="true" className="text-emerald-500">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
