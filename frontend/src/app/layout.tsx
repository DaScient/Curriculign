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
        {/* ── Global navigation ────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-black shadow-md group-hover:shadow-blue-300 transition">
                C
              </span>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Curriculign
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Home
              </Link>
              <Link
                href="/upload"
                className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Upload
              </Link>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/resources"
                className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Resources
              </Link>
              <a
                href="https://github.com/DaScient/Curriculign"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                GitHub ↗
              </a>
            </nav>

            {/* CTA */}
            <Link
              href="/dashboard?demo=true"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 transition"
            >
              Live Demo →
            </Link>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────────────── */}
        <main>{children}</main>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="border-t bg-slate-900 py-12 text-slate-400">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black">C</span>
                  <span className="text-base font-bold text-white">Curriculign</span>
                </div>
                <p className="text-sm leading-relaxed">
                  AI-powered curriculum alignment for ABET, WASC, and Common Core accreditation.
                </p>
                <p className="mt-3 text-xs text-slate-500">MIT License © 2026 DaScient</p>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-white">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/upload" className="hover:text-white transition">Upload Syllabus</Link></li>
                  <li><Link href="/dashboard?demo=true" className="hover:text-white transition">Live Demo</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                  <li><Link href="/resources" className="hover:text-white transition">Educator Resources</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-white">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://github.com/DaScient/Curriculign" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                      GitHub Repository ↗
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/DaScient/Curriculign/blob/main/docs/architecture.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                      Architecture Docs ↗
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/DaScient/Curriculign/blob/main/docs/api-reference.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
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
