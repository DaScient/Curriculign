const STEPS = [
  {
    number: "01",
    title: "Upload Your Document",
    description:
      "Drag and drop a PDF syllabus, lesson plan, or Markdown file. Curriculign accepts any format — polished course guides or rough drafts.",
    detail:
      "The ingestion pipeline extracts text, chunks it intelligently to preserve headings and tables, then generates semantic embeddings stored in your PostgreSQL + pgvector database.",
    color: "bg-blue-600",
  },
  {
    number: "02",
    title: "AI Agents Analyze",
    description:
      "Three specialized LangGraph nodes run in sequence — CLO Extractor, Gap Analyzer, and Bloom's Evaluator — producing a fully structured mapping JSON.",
    detail:
      "Node A extracts every Course Learning Outcome verbatim. Node B matches each CLO against your chosen framework via cosine similarity. Node C checks cognitive depth (Bloom's Taxonomy) and locates the assignment that evidences each outcome.",
    color: "bg-indigo-600",
  },
  {
    number: "03",
    title: "Act on Your Results",
    description:
      "The Curriculum Dashboard renders your coverage heatmap and a sortable data grid. Red cells are gaps. Green cells are evidence. Amber cells need attention.",
    detail:
      "Every mapping row includes the similarity score, both Bloom's levels, a gap flag, and an artifact reference. Export-ready for accreditation self-study documents.",
    color: "bg-violet-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From PDF upload to accreditation-ready evidence — in three steps.
          </p>
        </div>

        <div className="space-y-12">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col gap-6 md:flex-row ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Number bubble */}
              <div className="flex flex-shrink-0 items-start md:w-1/3">
                <div className={`${step.color} flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg`}>
                  {step.number}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-slate-600">{step.description}</p>
                </div>
              </div>
              {/* Detail card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600 md:w-2/3">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
