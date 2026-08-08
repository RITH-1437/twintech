import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, PackageSearch, Truck } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, inventory } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/inventory/low-stock")({
  head: seo(
    "Low stock — TwinTech Admin",
    "Items at or below their reorder point, ranked by urgency, with one-click purchase order drafting.",
  ),
  component: LowStock,
});

const rows = inventory.filter((i) => i.stock <= i.reorder);
type Row = (typeof rows)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Item", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "sku", header: "SKU", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.sku}</span> },
  { key: "warehouse", header: "Location", render: (r) => r.warehouse },
  { key: "stock", header: "On hand", render: (r) => <span className="tabular-nums font-medium text-destructive">{r.stock}</span> },
  { key: "reorder", header: "Reorder at", render: (r) => <span className="tabular-nums text-muted-foreground">{r.reorder}</span> },
  { key: "gap", header: "Shortfall", render: (r) => <span className="tabular-nums">{r.reorder - r.stock}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "action", header: "", render: () => <Button size="sm" variant="ghost">Draft PO</Button> },
];

function LowStock() {
  return (
    <AdminPage
      title="Low stock"
      description="Items at or under their reorder threshold."
      actions={
        <Button asChild variant="outline">
          <Link to="/admin/inventory">All inventory</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Items flagged" value={String(rows.length)} hint="Across 2 warehouses" icon={AlertTriangle} tone="warning" />
        <StatCard label="Out of stock" value="1" hint="Lost sales risk" icon={PackageSearch} tone="danger" />
        <StatCard label="Suggested spend" value={currency(6400)} hint="To restore cover" icon={Truck} />
      </div>
      <DataTable rows={rows} columns={columns} searchKeys={["name", "sku"]} rowKey="sku" />
    </AdminPage>
  );
}