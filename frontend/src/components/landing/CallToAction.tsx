import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="mt-12 mb-16">
      <div className="glass-pane relative overflow-hidden px-6 py-16 sm:py-20 text-center">
        {/* Soft accent wash — subtle, never harsh. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-200/30 via-indigo-200/20 to-violet-200/30"
        />

        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Ready to Transform Your{" "}
            <span className="text-accent-soft">Accreditation Process?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Stop spending months on manual spreadsheet mapping. Let AI agents find the
            gaps, locate the evidence, and generate the audit trail — in minutes.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/dashboard?demo=true">Explore the Demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/upload">Upload Your Syllabus</Link>
            </Button>
          </div>

          <p className="mt-8 text-xs text-slate-500">
            Open-source under the MIT License ·{" "}
            <a
              href="https://github.com/DaScient/Curriculign"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-slate-800 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
