"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadSyllabus, runAnalysis } from "@/lib/api";
import type { Framework } from "@/types/mapping";

type IngestionStatus = "idle" | "uploading" | "processing" | "ready" | "error";

const FRAMEWORKS: Framework[] = ["ABET", "WASC", "COMMON_CORE"];
const FRAMEWORK_LABELS: Record<Framework, string> = {
  ABET: "ABET (Engineering)",
  WASC: "WASC (Institutional)",
  COMMON_CORE: "Common Core (K-12)",
};

export default function SyllabusUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<IngestionStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [syllabusId, setSyllabusId] = useState<string | null>(null);
  const [framework, setFramework] = useState<Framework>("ABET");
  const [fields, setFields] = useState({
    course_code: "",
    course_title: "",
    institution_name: "",
    program_name: "",
  });

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      setStatus("idle");
      setErrorMsg("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"], "text/markdown": [".md"] },
    maxFiles: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const allFieldsFilled =
    file &&
    fields.course_code.trim() &&
    fields.course_title.trim() &&
    fields.institution_name.trim() &&
    fields.program_name.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !allFieldsFilled) return;

    try {
      setStatus("uploading");
      const uploaded = await uploadSyllabus(file, fields);
      setSyllabusId(uploaded.syllabus_id);
      setStatus("processing");
      await runAnalysis(uploaded.syllabus_id, framework);
      setStatus("ready");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred.");
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="glass-pane">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Upload a Syllabus or Lesson Plan</CardTitle>
          <p className="text-sm text-slate-500">
            Accepts PDF, plain text, or Markdown — up to 20 MB.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300 ease-out
                ${
                  isDragActive
                    ? "border-indigo-300 bg-indigo-50/60"
                    : "border-slate-300/70 bg-white/40 hover:border-indigo-300/70 hover:bg-white/60"
                }`}
            >
              <input {...getInputProps()} />
              <div className="text-4xl" aria-hidden="true">{file ? "📄" : "☁️"}</div>
              {file ? (
                <p className="mt-2 font-medium text-slate-700">{file.name}</p>
              ) : (
                <>
                  <p className="mt-2 font-medium text-slate-700">
                    {isDragActive ? "Drop it here…" : "Drag & drop a file, or click to browse"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">PDF, .txt, .md</p>
                </>
              )}
            </div>

            {/* Framework selector */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Accreditation Framework
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as Framework)}
                className="w-full rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/60"
              >
                {FRAMEWORKS.map((fw) => (
                  <option key={fw} value={fw}>
                    {FRAMEWORK_LABELS[fw]}
                  </option>
                ))}
              </select>
            </div>

            {/* Metadata fields */}
            {(
              [
                { name: "course_code", label: "Course Code", placeholder: "CE-301" },
                { name: "course_title", label: "Course Title", placeholder: "Structural Analysis" },
                { name: "institution_name", label: "Institution", placeholder: "State University" },
                { name: "program_name", label: "Program", placeholder: "Civil Engineering BS" },
              ] as const
            ).map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
                <input
                  name={name}
                  value={fields[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur transition-colors placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/60"
                />
              </div>
            ))}

            {/* Status indicator */}
            {status !== "idle" && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-xl border px-4 py-3 text-sm font-medium backdrop-blur transition-colors ${
                  status === "error"
                    ? "border-rose-200/70 bg-rose-50/70 text-rose-700"
                    : status === "ready"
                    ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-700"
                    : "border-sky-200/70 bg-sky-50/70 text-sky-700"
                }`}
              >
                {status === "uploading" && "⏳ Uploading and ingesting file…"}
                {status === "processing" && "🤖 AI agents analyzing CLOs…"}
                {status === "ready" && "✅ Analysis complete!"}
                {status === "error" && <span>❌ {errorMsg}</span>}
              </div>
            )}

            {/* CTA */}
            {status === "ready" && syllabusId ? (
              <Button asChild className="w-full">
                <a
                  href={`/dashboard?id=${encodeURIComponent(syllabusId)}&framework=${encodeURIComponent(framework)}`}
                >
                  View Results in Dashboard →
                </a>
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={!allFieldsFilled || status === "uploading" || status === "processing"}
              >
                {status === "uploading" || status === "processing"
                  ? "Analyzing…"
                  : "Upload & Analyze"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
