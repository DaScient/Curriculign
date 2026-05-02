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
    <div className="space-y-8 py-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Curriculum Dashboard
            {isDemo && (
              <span className="ml-3 rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-700">
                Demo Mode
              </span>
            )}
          </h1>
          {data && (
            <p className="mt-1 text-sm text-muted-foreground">
              {data.course_code} · {data.course_title} · Framework: {data.framework}
            </p>
          )}
        </div>

        {/* Framework selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Framework:</span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw}
                disabled={!isDemo}
                title={!isDemo ? "Switch frameworks by re-running analysis" : undefined}
                className={`px-3 py-1.5 transition ${
                  (data?.framework ?? initialFramework) === fw
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-white text-slate-600 hover:bg-slate-50"
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
        <div className="py-20 text-center text-slate-500">
          <div className="text-4xl mb-3">⏳</div>
          Loading analysis results…
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 p-6 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* No data, no ID */}
      {!loading && !data && !error && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-24 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-lg font-semibold text-slate-700">No analysis loaded</h2>
          <p className="mt-2 text-sm text-slate-500">
            <a href="/upload" className="text-blue-600 underline">Upload a syllabus</a> to run
            the AI pipeline, or{" "}
            <a href="/dashboard?demo=true" className="text-blue-600 underline">load the demo</a>.
          </p>
        </div>
      )}

      {/* Main content */}
      {data && (
        <>
          <StatsCards data={data} />

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 w-fit">
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                activeTab === "heatmap"
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Coverage Heatmap
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                activeTab === "table"
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
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
        <div className="py-20 text-center text-slate-500">
          <div className="text-4xl mb-3">⏳</div>
          Loading dashboard…
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
