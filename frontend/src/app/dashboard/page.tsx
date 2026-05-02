"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StatsCards from "@/components/dashboard/StatsCards";
import CoverageHeatmap from "@/components/dashboard/CoverageHeatmap";
import MappingTable from "@/components/dashboard/MappingTable";
import { getResults } from "@/lib/api";
import { DEMO_DATA } from "@/lib/demo-data";
import type { AnalysisResponse, Framework } from "@/types/mapping";

const FRAMEWORKS: Framework[] = ["ABET", "WASC", "COMMON_CORE"];
const FRAMEWORK_LABELS: Record<Framework, string> = {
  ABET: "ABET",
  WASC: "WASC",
  COMMON_CORE: "Common Core",
};

function DashboardContent() {
  const params = useSearchParams();
  const isDemo = params.get("demo") === "true";
  const syllabusId = params.get("id");
  const initialFramework = (params.get("framework") as Framework) ?? "ABET";

  const [data, setData] = useState<AnalysisResponse | null>(isDemo ? DEMO_DATA : null);
  const [loading, setLoading] = useState(!isDemo && !!syllabusId);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"heatmap" | "table">("heatmap");

  useEffect(() => {
    if (isDemo) {
      setData(DEMO_DATA);
      return;
    }
    if (!syllabusId) return;

    setLoading(true);
    getResults(syllabusId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isDemo, syllabusId]);

  return (
    <div className="space-y-8 py-8">
      {/* Page header (glass) */}
      <div className="glass-pane flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight text-slate-900">
            Curriculum Dashboard
            {isDemo && (
              <span className="rounded-full bg-indigo-100/80 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                Demo Mode
              </span>
            )}
          </h1>
          {data && (
            <p className="mt-1 text-sm text-slate-500">
              {data.course_code} · {data.course_title} · Framework: {data.framework}
            </p>
          )}
        </div>

        {/* Framework selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Framework:</span>
          <div className="flex overflow-hidden rounded-xl border border-white/70 bg-white/60 text-sm shadow-sm backdrop-blur">
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw}
                disabled={!isDemo}
                title={!isDemo ? "Switch frameworks by re-running analysis" : undefined}
                className={`px-3 py-1.5 transition-colors duration-200 ${
                  (data?.framework ?? initialFramework) === fw
                    ? "bg-gradient-to-br from-sky-500 to-indigo-500 text-white font-medium"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                }`}
              >
                {FRAMEWORK_LABELS[fw]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading / error states */}
      {loading && (
        <div className="glass-pane py-20 text-center text-slate-500">
          <div className="text-4xl mb-3" aria-hidden="true">⏳</div>
          Loading analysis results…
        </div>
      )}
      {error && (
        <div className="glass-pane border border-rose-200/70 bg-rose-50/70 p-6 text-rose-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* No data, no ID */}
      {!loading && !data && !error && (
        <div className="glass-pane border-dashed py-24 text-center">
          <div className="text-5xl mb-4" aria-hidden="true">📊</div>
          <h2 className="text-lg font-semibold text-slate-700">No analysis loaded</h2>
          <p className="mt-2 text-sm text-slate-500">
            <a href="/upload" className="text-indigo-600 underline-offset-4 hover:underline">Upload a syllabus</a> to run
            the AI pipeline, or{" "}
            <a href="/dashboard?demo=true" className="text-indigo-600 underline-offset-4 hover:underline">load the demo</a>.
          </p>
        </div>
      )}

      {/* Main content */}
      {data && (
        <>
          <StatsCards data={data} />

          {/* View toggle */}
          <div className="flex w-fit items-center gap-1 rounded-xl border border-white/70 bg-white/60 p-1 shadow-sm backdrop-blur">
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeTab === "heatmap"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Coverage Heatmap
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeTab === "table"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Mapping Table
            </button>
          </div>

          {activeTab === "heatmap" && <CoverageHeatmap data={data} />}
          {activeTab === "table" && <MappingTable rows={data.mappings} />}
        </>
      )}
    </div>
  );
}

// `useSearchParams` requires a Suspense boundary when the page is
// statically pre-rendered (e.g. by the GitHub Pages workflow).
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="glass-pane mt-8 py-20 text-center text-slate-500">
          <div className="text-4xl mb-3" aria-hidden="true">⏳</div>
          Loading dashboard…
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
