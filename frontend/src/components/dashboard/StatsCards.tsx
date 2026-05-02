import { Card, CardContent } from "@/components/ui/card";
import { coveragePercent, formatPercent } from "@/lib/utils";
import type { AnalysisResponse } from "@/types/mapping";

interface Props {
  data: AnalysisResponse;
}

export default function StatsCards({ data }: Props) {
  const pct = coveragePercent(data.covered_count, data.partial_count, data.total_clos);
  const gapPct = data.total_clos > 0
    ? data.uncovered_count / data.total_clos
    : 0;

  const cards = [
    {
      label: "CLOs Extracted",
      value: data.total_clos,
      sub: `across ${data.total_standards} standards`,
      color: "text-slate-800",
    },
    {
      label: "Covered",
      value: data.covered_count,
      sub: "fully aligned",
      color: "text-green-600",
    },
    {
      label: "Partial",
      value: data.partial_count,
      sub: "need attention",
      color: "text-amber-600",
    },
    {
      label: "Gaps",
      value: data.uncovered_count,
      sub: "not addressed",
      color: "text-red-600",
    },
    {
      label: "Coverage Score",
      value: formatPercent(pct),
      sub: `${formatPercent(gapPct)} gap rate`,
      color: pct >= 0.75 ? "text-green-600" : pct >= 0.5 ? "text-amber-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <Card key={c.label} className="glass-card gentle-lift text-center">
          <CardContent className="pt-5 pb-4">
            <div className={`text-3xl font-semibold ${c.color}`}>{c.value}</div>
            <div className="mt-1 text-sm font-medium text-slate-700">{c.label}</div>
            <div className="text-xs text-slate-500">{c.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
