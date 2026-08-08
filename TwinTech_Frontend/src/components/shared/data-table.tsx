import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

export type BulkAction = {
  label: string;
  icon?: LucideIcon;
  /** Ask for confirmation before running. */
  confirm?: boolean;
  destructive?: boolean;
  /** Return a toast message; omit to use a default. */
  run?: (ids: string[]) => string | void;
};

export function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  searchKeys,
  filter,
  rowKey,
  pageSize = 5,
  loading = false,
  bulkActions,
  recordLabel = "records",
  emptyTitle = "Nothing here yet",
  emptyDescription = "Records will appear as soon as activity starts flowing in.",
}: {
  rows: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  filter?: { label: string; key: keyof T; options: string[] };
  rowKey: keyof T;
  pageSize?: number;
  loading?: boolean;
  bulkActions?: BulkAction[];
  recordLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState<BulkAction | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery =
        !q || searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q));
      const matchesFilter =
        !filter || filterValue === "all" || String(row[filter.key]) === filterValue;
      return matchesQuery && matchesFilter;
    });
  }, [rows, query, searchKeys, filter, filterValue]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const visible = filtered.slice(current * pageSize, current * pageSize + pageSize);
  const allChecked = visible.length > 0 && visible.every((r) => selected.includes(String(r[rowKey])));
  const filteredIds = filtered.map((r) => String(r[rowKey]));
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selected.includes(id));

  const actions: BulkAction[] = bulkActions ?? [
    { label: "Bulk update", icon: Tag },
    { label: "Export selection", icon: Download },
    { label: "Delete", icon: Trash2, confirm: true, destructive: true },
  ];

  function runAction(action: BulkAction) {
    const ids = [...selected];
    const message = action.run?.(ids);
    setSelected([]);
    const text = message ?? `${action.label} applied to ${ids.length} ${recordLabel}`;
    if (action.destructive) {
      toast.error(text, { action: { label: "Undo", onClick: () => setSelected(ids) } });
    } else {
      toast.success(text, { action: { label: "Undo", onClick: () => setSelected(ids) } });
    }
  }

  return (
    <div className="surface-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search records…"
            aria-label="Search records"
            className="h-10 pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filter && (
            <Select
              value={filterValue}
              onValueChange={(v) => {
                setFilterValue(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-10 w-[168px]" aria-label={filter.label}>
                <Filter className="mr-1 size-3.5 text-muted-foreground" />
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label.toLowerCase()}</SelectItem>
                {filter.options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" className="h-10" onClick={() => toast("Advanced filters opened")}>
            <SlidersHorizontal /> Filters
          </Button>
          <Button variant="outline" size="sm" className="h-10" onClick={() => toast.success("Export queued as CSV")}>
            <Download /> Export
          </Button>
          <Button variant="outline" size="sm" className="h-10" onClick={() => toast("Import wizard opened")}>
            <Upload /> Import
          </Button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="animate-scale-in sticky top-16 z-20 flex flex-wrap items-center gap-2 border-b border-border bg-primary-soft px-4 py-2.5 text-sm">
          <span className="font-medium text-accent-foreground">
            {selected.length} of {filtered.length} {recordLabel} selected
          </span>
          {!allFilteredSelected && filtered.length > visible.length && (
            <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setSelected(filteredIds)}>
              <CheckSquare /> Select all {filtered.length} matching
            </Button>
          )}
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              size="sm"
              className={action.destructive ? "text-destructive hover:bg-destructive-soft" : undefined}
              onClick={() => (action.confirm ? setPending(action) : runAction(action))}
            >
              {action.icon && <action.icon />} {action.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSelected([])}>
            <X /> Clear
          </Button>
        </div>
      )}

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.label} {selected.length} {recordLabel}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This affects every selected record. You can undo from the confirmation toast for a few
              seconds afterwards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pending) runAction(pending);
                setPending(null);
              }}
            >
              {pending?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allChecked}
                  aria-label="Select all rows on this page"
                  onCheckedChange={(v) =>
                    setSelected(v ? visible.map((r) => String(r[rowKey])) : [])
                  }
                />
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-3.5">
                    <Skeleton className="size-4 rounded" />
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading &&
              visible.map((row) => {
                const id = String(row[rowKey]);
                const checked = selected.includes(id);
                return (
                  <tr
                    key={id}
                    data-state={checked ? "selected" : undefined}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/50 data-[state=selected]:bg-primary-soft/60"
                  >
                    <td className="px-4 py-3.5">
                      <Checkbox
                        checked={checked}
                        aria-label={`Select ${id}`}
                        onCheckedChange={(v) =>
                          setSelected((prev) => (v ? [...prev, id] : prev.filter((p) => p !== id)))
                        }
                      />
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-4 py-3.5 align-middle", c.className)}>
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length === 0 && (
        <div className="p-4">
          <EmptyState icon={Search} title={emptyTitle} description={emptyDescription} />
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length === 0 ? 0 : current * pageSize + 1}–
          {Math.min(filtered.length, (current + 1) * pageSize)} of {filtered.length} records
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft />
          </Button>
          {Array.from({ length: pages }).map((_, i) => (
            <Button
              key={i}
              variant={i === current ? "default" : "ghost"}
              size="icon-sm"
              aria-label={`Page ${i + 1}`}
              aria-current={i === current ? "page" : undefined}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
