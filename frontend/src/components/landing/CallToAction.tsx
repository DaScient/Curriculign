import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 text-white">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to Transform Your Accreditation Process?
        </h2>
        <p className="mt-4 text-lg text-blue-100">
          Stop spending months on manual spreadsheet mapping. Let AI agents find the
          gaps, locate the evidence, and generate the audit trail — in minutes.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl px-8">
            <Link href="/dashboard?demo=true">Explore the Demo</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
            <Link href="/upload">Upload Your Syllabus</Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-blue-200">
          Open-source under the MIT License ·{" "}
          <a
            href="https://github.com/DaScient/Curriculign"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </section>
  );
}
