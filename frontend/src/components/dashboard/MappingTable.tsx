"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { bloomsColor, cn } from "@/lib/utils";
import type { BloomsLevel, CoverageStatus, MappingRow } from "@/types/mapping";

const helper = createColumnHelper<MappingRow>();

function StatusBadge({ status }: { status: CoverageStatus }) {
  const variant =
    status === "covered"
      ? "covered"
      : status === "partial"
      ? "partial"
      : "uncovered";
  const label =
    status === "covered" ? "✓ Covered" : status === "partial" ? "~ Partial" : "✗ Uncovered";
  return <Badge variant={variant}>{label}</Badge>;
}

function BloomsBadge({ level }: { level: BloomsLevel | null }) {
  if (!level) return <span className="text-slate-400">—</span>;
  return (
    <span className={cn("rounded px-2 py-0.5 text-xs font-medium", bloomsColor(level))}>
      {level}
    </span>
  );
}

const COLUMNS = [
  helper.accessor("clo_text", {
    header: "Course Learning Outcome",
    cell: (info) => (
      <p className="max-w-xs text-sm leading-snug text-slate-700">{info.getValue()}</p>
    ),
  }),
  helper.accessor("standard.code", {
    id: "standard_code",
    header: "Standard",
    cell: (info) => (
      <div>
        <span className="font-mono text-xs font-semibold text-indigo-700">
          {info.getValue()}
        </span>
        <p className="mt-0.5 text-xs text-slate-500">{info.row.original.standard.title}</p>
      </div>
    ),
  }),
  helper.accessor("similarity_score", {
    header: "Similarity",
    cell: (info) => (
      <span className="font-mono text-sm">
        {(info.getValue() * 100).toFixed(1)}%
      </span>
    ),
  }),
  helper.accessor("blooms_level_clo", {
    header: "Bloom's (CLO)",
    cell: (info) => <BloomsBadge level={info.getValue()} />,
  }),
  helper.accessor("blooms_level_standard", {
    header: "Bloom's (Std)",
    cell: (info) => <BloomsBadge level={info.getValue()} />,
  }),
  helper.accessor("gap_flag", {
    header: "Depth Gap",
    cell: (info) =>
      info.getValue() ? (
        <span className="text-amber-600 font-semibold text-xs">⚠ Yes</span>
      ) : (
        <span className="text-slate-400 text-xs">—</span>
      ),
  }),
  helper.accessor("artifact_reference", {
    header: "Artifact",
    cell: (info) =>
      info.getValue() ? (
        <p className="max-w-[160px] text-xs text-slate-600 leading-snug">{info.getValue()}</p>
      ) : (
        <span className="text-slate-400 text-xs">—</span>
      ),
  }),
  helper.accessor("coverage_status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
];

interface Props {
  rows: MappingRow[];
}

export default function MappingTable({ rows }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: rows,
    columns: COLUMNS,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Global filter */}
      <div className="flex items-center gap-3">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search CLOs, standards, artifacts…"
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s)
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide",
                      header.column.getCanSort() && "cursor-pointer select-none hover:text-slate-900"
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc"
                      ? " ↑"
                      : header.column.getIsSorted() === "desc"
                      ? " ↓"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {table.getFilteredRowModel().rows.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No results match your search.
          </div>
        )}
      </div>
    </div>
  );
}
