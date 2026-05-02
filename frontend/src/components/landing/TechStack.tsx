const STACK = [
  { label: "Next.js 14", desc: "App Router, TypeScript, Server Components", icon: "▲" },
  { label: "FastAPI", desc: "Python 3.11+, async, auto OpenAPI docs", icon: "⚡" },
  { label: "LangGraph", desc: "Stateful multi-node AI agent workflows", icon: "🔗" },
  { label: "pgvector", desc: "PostgreSQL semantic search at database-native speed", icon: "🗄️" },
  { label: "OpenAI API", desc: "GPT-4o-mini + text-embedding-3-small", icon: "🤖" },
  { label: "Tailwind CSS", desc: "Utility-first, fully responsive UI", icon: "🎨" },
  { label: "TanStack Table v8", desc: "Headless, performant data grid with sorting & filtering", icon: "📊" },
  { label: "Unstructured.io", desc: "Hi-res PDF parsing preserving headings and tables", icon: "📄" },
];

export default function TechStack() {
  return (
    <section className="mt-12">
      <div className="glass-pane px-6 py-16 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Built on the Right Foundation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Every tool chosen for production reliability, open standards, and zero vendor lock-in.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((item) => (
            <div
              key={item.label}
              className="glass-card gentle-lift p-4"
            >
              <div className="mb-2 text-2xl" aria-hidden="true">{item.icon}</div>
              <div className="text-sm font-semibold text-slate-800">{item.label}</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
