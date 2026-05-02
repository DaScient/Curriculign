import { cn, coverageColor } from "@/lib/utils";
import type { AnalysisResponse, MappingRow } from "@/types/mapping";

interface Props {
  data: AnalysisResponse;
}

// Truncate long CLO text for row labels
function shortClo(text: string, maxLen = 55): string {
  return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + "…" : text;
}

// One cell in the heatmap grid
function HeatCell({ row }: { row: MappingRow }) {
  const bg = coverageColor(row.coverage_status);
  const label =
    row.coverage_status === "covered"
      ? "✓"
      : row.coverage_status === "partial"
      ? "~"
      : "✗";
  return (
    <div
      className={cn(
        bg,
        "group relative flex h-10 w-10 cursor-default items-center justify-center rounded text-xs font-bold text-white shadow-sm"
      )}
      title={`${row.standard.code}: ${(row.similarity_score * 100).toFixed(0)}% similarity`}
    >
      {label}
      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-left text-xs text-white shadow-lg group-hover:block">
        <div className="font-semibold">{row.standard.code}</div>
        <div className="mt-0.5 text-slate-300">{row.standard.title}</div>
        <div className="mt-1">
          Similarity:{" "}
          <span className="font-medium">{(row.similarity_score * 100).toFixed(1)}%</span>
        </div>
        {row.blooms_level_clo && (
          <div>
            Bloom&apos;s: CLO={row.blooms_level_clo} / Std={row.blooms_level_standard}
          </div>
        )}
        {row.gap_flag && (
          <div className="mt-1 font-semibold text-amber-400">⚠ Cognitive depth gap</div>
        )}
      </div>
    </div>
  );
}

export default function CoverageHeatmap({ data }: Props) {
  // Collect unique standards (columns)
  const standardsMap = new Map<string, { code: string; title: string }>();
  for (const m of data.mappings) {
    if (!standardsMap.has(m.standard.code)) {
      standardsMap.set(m.standard.code, {
        code: m.standard.code,
        title: m.standard.title,
      });
    }
  }
  const standards = Array.from(standardsMap.values());

  // Build a lookup: clo_text + standard_code → MappingRow
  const lookup = new Map<string, MappingRow>();
  for (const m of data.mappings) {
    lookup.set(`${m.clo_text}|||${m.standard.code}`, m);
  }

  // Unique CLOs (rows)
  const clos = Array.from(new Set(data.mappings.map((m) => m.clo_text)));

  return (
    <div className="glass-pane overflow-x-auto">
      <div className="min-w-[640px] p-5">
        <div className="mb-3 flex items-center gap-6 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-emerald-400/90" />
            Covered (≥ 75%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-amber-400/90" />
            Partial (≥ 55%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-rose-400/90" />
            Uncovered
          </span>
        </div>

        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="w-72 border-b border-slate-200/70 pb-2 pr-4 text-left font-medium text-slate-500">
                Course Learning Outcome
              </th>
              {standards.map((s) => (
                <th
                  key={s.code}
                  className="border-b border-slate-200/70 px-1 pb-2 text-center font-medium text-slate-500"
                  title={s.title}
                >
                  <div className="truncate max-w-[44px]" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", height: 80 }}>
                    {s.code}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clos.map((clo, ri) => (
              <tr key={ri} className="transition-colors hover:bg-white/60">
                <td className="border-b border-slate-200/60 py-2 pr-4 align-middle text-slate-700">
                  {shortClo(clo)}
                </td>
                {standards.map((s) => {
                  const row = lookup.get(`${clo}|||${s.code}`);
                  return (
                    <td key={s.code} className="border-b border-slate-200/60 px-1 py-2 text-center align-middle">
                      {row ? (
                        <HeatCell row={row} />
                      ) : (
                        <div className="mx-auto h-10 w-10 rounded bg-slate-100/70" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
