import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { NativeSelect } from "./native-select";
import { EmptyState } from "./empty-state";

/* eslint-disable react/prop-types */

/**
 * Modern HTML table with client-side sorting, pagination and optional row
 * selection — replaces AG Grid for list screens.
 *
 * columns: [{ key, header, sortable, sortValue(row), render(row), className, headerClassName }]
 * Filtering lives in the parent; pass the already-filtered `rows`.
 */
export function DataTable({
  columns,
  rows,
  getRowId = (row) => row.id,
  loading = false,
  emptyTitle = "Aucune donnée",
  emptyDescription,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  label = "éléments",
  className,
}) {
  const [sort, setSort] = useState(null); // { key, dir: "asc" | "desc" }
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const headerCheckboxRef = useRef(null);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const value = (row) => (col.sortValue ? col.sortValue(row) : row[col.key]);
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * factor;
      return String(av).localeCompare(String(bv), "fr", { numeric: true }) * factor;
    });
  }, [rows, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [rows, pageSize]);

  const pageIds = pageRows.map(getRowId);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedSet.has(id));
  const somePageSelected = pageIds.some((id) => selectedSet.has(id));

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = somePageSelected && !allPageSelected;
    }
  }, [somePageSelected, allPageSelected]);

  const toggleAll = () => {
    if (!onSelectionChange) return;
    const next = new Set(selectedSet);
    pageIds.forEach((id) => (allPageSelected ? next.delete(id) : next.add(id)));
    onSelectionChange([...next]);
  };

  const toggleRow = (id) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedSet);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange([...next]);
  };

  const toggleSort = (key) =>
    setSort((s) => (s?.key === key ? (s.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" }));

  const start = sortedRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, sortedRows.length);
  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/60">
              {selectable && (
                <th className="w-12 px-3 py-2.5">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer accent-primary"
                    checked={allPageSelected}
                    onChange={toggleAll}
                    aria-label="Tout sélectionner sur la page"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    col.headerClassName
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="group inline-flex cursor-pointer items-center gap-1 bg-transparent transition hover:text-foreground"
                    >
                      {col.header}
                      {sort?.key === col.key ? (
                        sort.dir === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-primary" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-40 transition group-hover:opacity-100" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0">
                  {selectable && (
                    <td className="px-3 py-3.5">
                      <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageRows.length ? (
              pageRows.map((row) => {
                const id = getRowId(row);
                const isSelected = selectable && selectedSet.has(id);
                return (
                  <tr
                    key={id}
                    className={cn(
                      "border-b transition-colors last:border-0 hover:bg-muted/40",
                      isSelected && "bg-primary/5"
                    )}
                  >
                    {selectable && (
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer accent-primary"
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                          aria-label="Sélectionner la ligne"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3 align-middle", col.className)}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={colSpan}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: result count, page size, pager */}
      <div className="flex flex-col gap-3 border-t bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-xs text-muted-foreground">
          {sortedRows.length
            ? `${start}–${end} sur ${sortedRows.length} ${label}`
            : "Aucun résultat"}
        </p>
        <div className="flex items-center gap-3">
          <NativeSelect
            className="h-8 w-[120px] text-xs"
            value={String(pageSize)}
            onChange={(e) => setPageSize(Number(e.target.value))}
            options={pageSizeOptions.map((n) => ({ value: String(n), label: `${n} / page` }))}
            aria-label="Lignes par page"
          />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              aria-label="Page précédente"
            >
              <ChevronLeft />
            </Button>
            <span className="min-w-[80px] text-center text-xs text-muted-foreground">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              aria-label="Page suivante"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
