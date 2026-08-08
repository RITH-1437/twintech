import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, FileText, ShoppingBag, Wrench } from "lucide-react";
import { DashShell } from "@/components/dash/dash-shell";
import { customerNav } from "@/components/dash/nav-config";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ChartCard, TrendLineChart } from "@/components/shared/charts";
import { RepairTimeline } from "@/components/shared/repair-timeline";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, orders, revenueSeries, timeline } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/")({
  head: seo(
    "Customer dashboard — TwinTech",
    "Track your TwinTech orders, active repair jobs, warranties and payment history in one place.",
  ),
  component: CustomerDashboard,
});

type Order = (typeof orders)[number];

const columns: Column<Order>[] = [
  { key: "id", header: "Order", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "date", header: "Date", render: (r) => <span className="text-muted-foreground">{r.date}</span> },
  { key: "items", header: "Items", render: (r) => <span className="tabular-nums">{r.items}</span> },
  { key: "total", header: "Total", render: (r) => <span className="tabular-nums">{currency(r.total)}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function CustomerDashboard() {
  return (
    <DashShell
      groups={customerNav}
      workspace="Customer portal"
      user={{ name: "Sokha Chan", email: "sokha@twintech.dev", initials: "SC" }}
      breadcrumb={["TwinTech", "Dashboard"]}
    >
      <PageHeader
        title="Welcome back, Sokha"
        description="Two repairs in progress and one order awaiting payment."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/dashboard/repairs">View repairs</Link>
            </Button>
            <Button asChild>
              <Link to="/repairs">Book a repair</Link>
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open orders" value="4" delta={12} hint="vs last month" icon={ShoppingBag} />
        <StatCard label="Active repairs" value="2" hint="1 awaiting approval" icon={Wrench} tone="warning" />
        <StatCard label="Lifetime spend" value={currency(18420)} delta={8} icon={CreditCard} tone="success" />
        <StatCard label="Open invoices" value="1" hint="Due Jul 30" icon={FileText} tone="danger" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <ChartCard title="Your spend" description="Monthly total across orders and repairs">
          <TrendLineChart data={revenueSeries} dataKey="orders" />
        </ChartCard>
        <div className="surface-panel p-5">
          <h3 className="text-sm font-semibold text-foreground">Repair RPR-2481 · MacBook Pro 14</h3>
          <p className="mt-1 mb-5 text-xs text-muted-foreground">Estimated handover Jul 28</p>
          <RepairTimeline steps={timeline} />
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Recent orders</h2>
        <DataTable
          rows={orders}
          columns={columns}
          searchKeys={["id", "status"]}
          filter={{ label: "Status", key: "status", options: ["Paid", "Fulfilled", "Pending", "Refunded"] }}
          rowKey="id"
        />
      </div>
    </DashShell>
  );
}
