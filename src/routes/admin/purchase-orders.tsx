import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Clock, Truck } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, purchaseOrders } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/purchase-orders")({
  head: seo(
    "Purchase orders — TwinTech Admin",
    "Raise, approve and receive purchase orders with supplier ETAs and landed-cost tracking.",
  ),
  component: AdminPurchaseOrders,
});

type Row = (typeof purchaseOrders)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "PO", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "supplier", header: "Supplier", render: (r) => r.supplier },
  { key: "items", header: "Units", render: (r) => <span className="tabular-nums">{r.items}</span> },
  { key: "total", header: "Total", render: (r) => <span className="tabular-nums">{currency(r.total)}</span> },
  { key: "raised", header: "Raised", render: (r) => <span className="text-muted-foreground">{r.raised}</span> },
  { key: "eta", header: "ETA", render: (r) => r.eta },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminPurchaseOrders() {
  return (
    <AdminPage title="Purchase orders" description="Inbound stock commitments and receiving." actions={<Button>Raise PO</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open POs" value="4" hint="2 arriving this week" icon={ClipboardList} tone="warning" />
        <StatCard label="Committed value" value={currency(72800)} delta={5} hint="Not yet received" icon={Truck} />
        <StatCard label="Avg receipt time" value="8 days" delta={-9} hint="From raise to receive" icon={Clock} tone="success" />
      </div>
      <DataTable
        rows={purchaseOrders}
        columns={columns}
        searchKeys={["id", "supplier"]}
        filter={{ label: "Status", key: "status", options: ["Pending", "Approved", "Processing", "Completed", "Cancelled"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}