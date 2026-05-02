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
    <section className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Built on the Right Foundation</h2>
          <p className="mt-4 text-slate-400">
            Every tool chosen for production reliability, open standards, and zero vendor lock-in.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="mb-2 text-2xl">{item.icon}</div>
              <div className="font-semibold">{item.label}</div>
              <div className="mt-1 text-xs text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
