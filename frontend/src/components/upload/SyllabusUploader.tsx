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
      <Card>
        <CardHeader>
          <CardTitle>Upload a Syllabus or Lesson Plan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Accepts PDF, plain text, or Markdown — up to 20 MB.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"}`}
            >
              <input {...getInputProps()} />
              <div className="text-4xl">{file ? "📄" : "☁️"}</div>
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
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* Status indicator */}
            {status !== "idle" && (
              <div
                className={`rounded-lg px-4 py-3 text-sm font-medium ${
                  status === "error"
                    ? "bg-red-50 text-red-700"
                    : status === "ready"
                    ? "bg-green-50 text-green-700"
                    : "bg-blue-50 text-blue-700"
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
