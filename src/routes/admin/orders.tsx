import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, PackageCheck, ShoppingBag, Undo2 } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, orders } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/orders")({
  head: seo(
    "Orders — TwinTech Admin",
    "Process, fulfil and refund customer orders with payment channel, basket size and branch context.",
  ),
  component: AdminOrders,
});

type Row = (typeof orders)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Order", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "customer", header: "Customer", render: (r) => r.customer },
  { key: "items", header: "Items", render: (r) => <span className="tabular-nums">{r.items}</span> },
  { key: "total", header: "Total", render: (r) => <span className="tabular-nums">{currency(r.total)}</span> },
  { key: "method", header: "Payment", render: (r) => <span className="text-muted-foreground">{r.method}</span> },
  { key: "date", header: "Date", render: (r) => <span className="text-muted-foreground">{r.date}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminOrders() {
  return (
    <AdminPage
      title="Orders"
      description="512 orders this month across four branches."
      actions={<Button>Create order</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders MTD" value="512" delta={9} hint="vs June" icon={ShoppingBag} />
        <StatCard label="Order value" value={currency(146300)} delta={10} hint="Gross" icon={DollarSign} tone="success" />
        <StatCard label="Awaiting fulfilment" value="12" hint="Oldest 6h" icon={PackageCheck} tone="warning" />
        <StatCard label="Refunds" value="3" delta={-2} hint="0.6% of orders" icon={Undo2} tone="danger" />
      </div>
      <DataTable
        rows={orders}
        columns={columns}
        searchKeys={["id", "customer", "method"]}
        filter={{ label: "Status", key: "status", options: ["Paid", "Fulfilled", "Pending", "Refunded"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}