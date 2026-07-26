import { createFileRoute } from "@tanstack/react-router";
import { Building2, Clock, Truck } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, suppliers } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/suppliers")({
  head: seo(
    "Suppliers — TwinTech Admin",
    "Supplier directory with lead times, open purchase orders and annual spend per vendor.",
  ),
  component: AdminSuppliers,
});

type Row = (typeof suppliers)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Supplier", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "category", header: "Category", render: (r) => r.category },
  { key: "contact", header: "Contact", render: (r) => <span className="text-muted-foreground">{r.contact}</span> },
  { key: "leadTime", header: "Lead time", render: (r) => r.leadTime },
  { key: "openPOs", header: "Open POs", render: (r) => <span className="tabular-nums">{r.openPOs}</span> },
  { key: "spend", header: "Spend", render: (r) => <span className="tabular-nums">{currency(r.spend)}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminSuppliers() {
  return (
    <AdminPage title="Suppliers" description="Vendor performance and procurement contacts." actions={<Button>Add supplier</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active suppliers" value="4" hint="Of 5 registered" icon={Building2} tone="success" />
        <StatCard label="Avg lead time" value="9 days" delta={-6} hint="Improving" icon={Clock} />
        <StatCard label="Annual spend" value={currency(354250)} delta={8} hint="Year to date" icon={Truck} />
      </div>
      <DataTable
        rows={suppliers}
        columns={columns}
        searchKeys={["name", "category", "contact"]}
        filter={{ label: "Category", key: "category", options: ["Components", "Monitors", "Storage", "Peripherals", "Power"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}