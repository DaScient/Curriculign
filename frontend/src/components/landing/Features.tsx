import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: "🎯",
    title: "ABET Precision Engine",
    subtitle: "For Engineering Programs",
    description:
      "The Gap Analyzer checks not just that a CLO mentions 'design' — it verifies the full context: public health, safety, welfare, and socio-environmental constraints. The Artifact Locator then cites the exact assignment that evidences each of the 7 Student Outcomes.",
    highlights: ["7 Student Outcomes", "Performance Indicators", "Artifact Locator"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: "🕸️",
    title: "WASC Institutional Aligner",
    subtitle: "For Regional Accreditation",
    description:
      "Maps the full Russian nesting-doll hierarchy: CLO → PLO → ILO. Validates that a Freshman History class rolls up to the university's ILO for Global Citizenship. Visualize Core Competency coverage across a 4-year degree in one heatmap.",
    highlights: ["5 Core Competencies", "Hierarchical roll-up", "Mission alignment"],
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: "🏷️",
    title: "Common Core Auto-Tagger",
    subtitle: "For K-12 Districts",
    description:
      "Teachers submit lesson plans or worksheets and the agent instantly assigns the exact CCSS alphanumeric code — no more manual LMS tagging. Administrators get a district-wide view of standard coverage before state testing season.",
    highlights: ["Math + ELA standards", "Alphanumeric codes", "LMS-ready output"],
    color: "from-emerald-500 to-teal-600",
  },
];

export default function Features() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            One Platform. Every Framework.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            The Polymorphic Standard Engine adapts to any accreditation body — without
            a single line of backend code change.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="overflow-hidden border-0 shadow-md">
              <div className={`h-1.5 w-full bg-gradient-to-r ${f.color}`} />
              <CardHeader className="pb-2">
                <div className="mb-2 text-3xl">{f.icon}</div>
                <CardTitle className="text-xl">{f.title}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">{f.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-600">{f.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {f.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-green-500">✓</span>
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
