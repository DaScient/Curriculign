"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Hero — soft-white glass pane.
 * Replaces the previous dark-navy gradient with a calm, single-pane
 * frosted-glass surface that floats over the body's ambient backdrop.
 */
export default function Hero() {
  return (
    <section className="relative mt-8 sm:mt-12">
      <div className="glass-pane relative overflow-hidden px-6 py-20 sm:py-24 text-center">
        {/* product badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-1 text-xs font-medium tracking-wide text-slate-600 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Now supporting ABET · WASC · Common Core
        </span>

        <h1 className="mx-auto mt-2 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Align Every Course to{" "}
          <span className="text-accent-soft">Every Standard</span>
          <span className="text-slate-700"> — Automatically.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Curriculign uses AI agents to map your syllabi and lesson plans to
          accreditation standards in minutes, not months. ABET engineering reviews,
          WASC institutional audits, Common Core auto-tagging — one calm platform.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="px-8">
            <Link href="/dashboard?demo=true">View Live Demo</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/upload">Upload a Syllabus →</Link>
          </Button>
        </div>

        {/* trust line */}
        <p className="mt-10 text-xs text-slate-500">
          Open-source · MIT License · Built with Next.js 14, FastAPI, LangGraph &amp; pgvector
        </p>
      </div>
    </section>
  );
}
