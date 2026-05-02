"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 py-24 text-white">
      {/* decorative grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDB2Nmg2di02aC02em0tNiAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* product badge */}
        <span className="mb-6 inline-block rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-200 backdrop-blur-sm">
          Now supporting ABET · WASC · Common Core
        </span>

        <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Align Every Course to{" "}
          <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Every Standard
          </span>
          {" "}— Automatically.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
          Curriculign uses AI agents to map your syllabi and lesson plans to
          accreditation standards in minutes, not months. ABET engineering reviews.
          WASC institutional audits. Common Core auto-tagging. One platform.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30 px-8">
            <Link href="/dashboard?demo=true">View Live Demo</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <Link href="/upload">Upload a Syllabus →</Link>
          </Button>
        </div>

        {/* trust line */}
        <p className="mt-10 text-sm text-slate-400">
          Open-source · MIT License · Built with Next.js 14, FastAPI, LangGraph &amp; pgvector
        </p>
      </div>
    </section>
  );
}
