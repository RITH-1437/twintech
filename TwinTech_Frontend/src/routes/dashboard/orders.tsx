import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, ShoppingBag, Truck, Wallet } from "lucide-react";
import { CustomerPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, customerOrders } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/orders")({
  head: seo(
    "My orders — TwinTech",
    "Track every TwinTech order: fulfilment status, payment method, delivery estimate and invoices in one place.",
  ),
  component: CustomerOrders,
});

type Row = (typeof customerOrders)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Order", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "date", header: "Placed", render: (r) => <span className="text-muted-foreground">{r.date}</span> },
  { key: "items", header: "Items", render: (r) => <span className="tabular-nums">{r.items}</span> },
  { key: "total", header: "Total", render: (r) => <span className="tabular-nums">{currency(r.total)}</span> },
  { key: "method", header: "Payment", render: (r) => r.method },
  { key: "eta", header: "Delivery", render: (r) => <span className="text-muted-foreground">{r.eta}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function CustomerOrders() {
  return (
    <CustomerPage
      title="My orders"
      crumb="My orders"
      description="Purchases across store pickup and delivery."
      actions={
        <Button asChild variant="outline">
          <Link to="/products">Continue shopping</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders placed" value="14" delta={12} hint="Lifetime" icon={ShoppingBag} />
        <StatCard label="Lifetime spend" value={currency(18420)} delta={8} hint="Business tier" icon={Wallet} tone="success" />
        <StatCard label="In transit" value="1" hint="Arrives Jul 27" icon={Truck} tone="warning" />
        <StatCard label="Items owned" value="27" hint="Serial tracked" icon={Package} />
      </div>
      <DataTable
        rows={customerOrders}
        columns={columns}
        searchKeys={["id", "method"]}
        filter={{ label: "Status", key: "status", options: ["Paid", "Fulfilled", "Refunded"] }}
        rowKey="id"
      />
    </CustomerPage>
  );
}