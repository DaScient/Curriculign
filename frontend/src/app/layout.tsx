import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Curriculign — Syllabus & Curriculum Aligner",
  description:
    "AI-powered platform that maps Course Learning Outcomes to ABET, WASC, and Common Core accreditation standards automatically.",
  openGraph: {
    title: "Curriculign — Syllabus & Curriculum Aligner",
    description:
      "Align every course to every standard — automatically. ABET, WASC, and Common Core from a single AI-powered platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ── Global navigation (glass chrome) ─────────────────────────── */}
        <header className="sticky top-0 z-50 glass-chrome border-b">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-sm font-black shadow-sm shadow-indigo-200/60 transition group-hover:shadow-indigo-300/70">
                C
              </span>
              <span className="text-lg font-semibold text-slate-800 tracking-tight">
                Curriculign
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-slate-600 transition-colors duration-200 hover:bg-white/70 hover:text-slate-900"
              >
                Home
              </Link>
              <Link
                href="/upload"
                className="rounded-lg px-3 py-2 text-slate-600 transition-colors duration-200 hover:bg-white/70 hover:text-slate-900"
              >
                Upload
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-slate-600 transition-colors duration-200 hover:bg-white/70 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/resources"
                className="rounded-lg px-3 py-2 text-slate-600 transition-colors duration-200 hover:bg-white/70 hover:text-slate-900"
              >
                Resources
              </Link>
              <a
                href="https://github.com/DaScient/Curriculign"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2 text-slate-600 transition-colors duration-200 hover:bg-white/70 hover:text-slate-900"
              >
                GitHub ↗
              </a>
            </nav>

            {/* CTA */}
            <Link
              href="/dashboard?demo=true"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
            >
              Live Demo →
            </Link>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────────────── */}
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6">{children}</main>

        {/* ── Footer (light glass — matches the single-pane aesthetic) ── */}
        <footer className="mt-16 border-t border-white/60 bg-white/40 py-12 text-slate-600 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-xs font-black">
                    C
                  </span>
                  <span className="text-base font-semibold text-slate-800">Curriculign</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  AI-powered curriculum alignment for ABET, WASC, and Common Core accreditation.
                </p>
                <p className="mt-3 text-xs text-slate-500">MIT License © 2026 DaScient</p>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-slate-800">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/upload" className="transition-colors hover:text-slate-900">Upload Syllabus</Link></li>
                  <li><Link href="/dashboard?demo=true" className="transition-colors hover:text-slate-900">Live Demo</Link></li>
                  <li><Link href="/dashboard" className="transition-colors hover:text-slate-900">Dashboard</Link></li>
                  <li><Link href="/resources" className="transition-colors hover:text-slate-900">Educator Resources</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-slate-800">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://github.com/DaScient/Curriculign" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-900">
                      GitHub Repository ↗
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/DaScient/Curriculign/blob/main/docs/architecture.md" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-900">
                      Architecture Docs ↗
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/DaScient/Curriculign/blob/main/docs/api-reference.md" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-900">
                      API Reference ↗
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
