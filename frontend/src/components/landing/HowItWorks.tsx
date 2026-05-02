const STEPS = [
  {
    number: "01",
    title: "Upload Your Document",
    description:
      "Drag and drop a PDF syllabus, lesson plan, or Markdown file. Curriculign accepts any format — polished course guides or rough drafts.",
    detail:
      "The ingestion pipeline extracts text, chunks it intelligently to preserve headings and tables, then generates semantic embeddings stored in your PostgreSQL + pgvector database.",
    accent: "from-sky-300/80 to-indigo-300/80",
  },
  {
    number: "02",
    title: "AI Agents Analyze",
    description:
      "Three specialized LangGraph nodes run in sequence — CLO Extractor, Gap Analyzer, and Bloom's Evaluator — producing a fully structured mapping JSON.",
    detail:
      "Node A extracts every Course Learning Outcome verbatim. Node B matches each CLO against your chosen framework via cosine similarity. Node C checks cognitive depth (Bloom's Taxonomy) and locates the assignment that evidences each outcome.",
    accent: "from-indigo-300/80 to-violet-300/80",
  },
  {
    number: "03",
    title: "Act on Your Results",
    description:
      "The Curriculum Dashboard renders your coverage heatmap and a sortable data grid. Red cells are gaps. Green cells are evidence. Amber cells need attention.",
    detail:
      "Every mapping row includes the similarity score, both Bloom's levels, a gap flag, and an artifact reference. Export-ready for accreditation self-study documents.",
    accent: "from-violet-300/80 to-fuchsia-300/80",
  },
];

export default function HowItWorks() {
  return (
    <section className="mt-12">
      <div className="glass-pane px-6 py-16 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            From PDF upload to accreditation-ready evidence — in three steps.
          </p>
        </div>

        <div className="space-y-8">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col gap-6 md:flex-row md:items-stretch ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Number + title */}
              <div className="flex flex-shrink-0 items-start md:w-1/3">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-base font-semibold text-slate-800 shadow-sm ring-1 ring-white/70`}
                >
                  {step.number}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </div>
              </div>
              {/* Detail card */}
              <div className="glass-card gentle-lift flex-1 p-5 text-sm leading-relaxed text-slate-600">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
