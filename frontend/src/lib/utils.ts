import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BloomsLevel, CoverageStatus } from "@/types/mapping";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function coverageColor(status: CoverageStatus): string {
  switch (status) {
    case "covered":
      return "bg-green-500";
    case "partial":
      return "bg-amber-400";
    case "uncovered":
      return "bg-red-500";
  }
}

export function coverageBadgeVariant(
  status: CoverageStatus
): "covered" | "partial" | "uncovered" {
  return status;
}

export function bloomsColor(level: BloomsLevel | null): string {
  if (!level) return "bg-slate-200 text-slate-600";
  const map: Record<BloomsLevel, string> = {
    Remember: "bg-slate-100 text-slate-700",
    Understand: "bg-blue-100 text-blue-700",
    Apply: "bg-teal-100 text-teal-700",
    Analyze: "bg-indigo-100 text-indigo-700",
    Evaluate: "bg-purple-100 text-purple-700",
    Create: "bg-rose-100 text-rose-700",
  };
  return map[level];
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function coveragePercent(
  covered: number,
  partial: number,
  total: number
): number {
  if (total === 0) return 0;
  return (covered + partial * 0.5) / total;
}
