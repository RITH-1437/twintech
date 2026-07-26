import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Boxes, PackageSearch, Warehouse } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { BarsChart, ChartCard } from "@/components/shared/charts";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, inventory } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/inventory/")({
  head: seo(
    "Inventory — TwinTech Admin",
    "Stock levels, serial counts and valuation across every TwinTech warehouse and branch.",
  ),
  component: AdminInventory,
});

type Row = (typeof inventory)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Item", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "sku", header: "SKU", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.sku}</span> },
  { key: "warehouse", header: "Location", render: (r) => r.warehouse },
  { key: "stock", header: "On hand", render: (r) => <span className="tabular-nums">{r.stock}</span> },
  { key: "reorder", header: "Reorder at", render: (r) => <span className="tabular-nums text-muted-foreground">{r.reorder}</span> },
  { key: "value", header: "Value", render: (r) => <span className="tabular-nums">{currency(r.value)}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminInventory() {
  return (
    <AdminPage
      title="Stock & warehouse"
      crumb="Inventory"
      description="Serial-tracked units across four locations."
      actions={
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/inventory/low-stock">Low stock</Link>
          </Button>
          <Button>Stock adjustment</Button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Stock value" value={currency(109430)} delta={6} hint="At cost" icon={Boxes} tone="success" />
        <StatCard label="Units on hand" value="229" delta={4} hint="Serial tracked" icon={Warehouse} />
        <StatCard label="Below reorder" value="2" hint="Action needed" icon={AlertTriangle} tone="warning" />
        <StatCard label="Out of stock" value="1" hint="Tactile 75" icon={PackageSearch} tone="danger" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px] xl:items-start">
        <DataTable
          rows={inventory}
          columns={columns}
          searchKeys={["name", "sku", "warehouse"]}
          filter={{ label: "Status", key: "status", options: ["Healthy", "Low", "Out"] }}
          rowKey="sku"
        />
        <ChartCard title="Stock by item" description="Units on hand">
          <BarsChart data={inventory} dataKey="stock" labelKey="sku" />
        </ChartCard>
      </div>
    </AdminPage>
  );
}