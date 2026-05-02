import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Curriculign – Syllabus & Curriculum Aligner",
  description:
    "AI-powered platform for mapping Course Learning Outcomes to accreditation standards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
            <span className="text-xl font-bold text-primary">Curriculign</span>
            <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
              <a href="/" className="hover:text-foreground">
                Upload
              </a>
              <a href="/dashboard" className="hover:text-foreground">
                Dashboard
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
