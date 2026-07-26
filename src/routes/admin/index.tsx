import { createFileRoute } from "@tanstack/react-router";
import { Boxes, DollarSign, ShoppingBag, Wrench } from "lucide-react";
import { DashShell } from "@/components/dash/dash-shell";
import { adminNav } from "@/components/dash/nav-config";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  BarsChart,
  ChannelPieChart,
  ChartCard,
  RevenueAreaChart,
} from "@/components/shared/charts";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import {
  channelSplit,
  currency,
  repairJobs,
  revenueSeries,
  topProducts,
} from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: seo(
    "Admin console — TwinTech Operations",
    "Revenue, inventory health, repair throughput and payment settlement analytics for your TwinTech stores.",
  ),
  component: AdminDashboard,
});

type Job = (typeof repairJobs)[number];

const columns: Column<Job>[] = [
  { key: "id", header: "Job", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "customer", header: "Customer", render: (r) => r.customer },
  { key: "device", header: "Device", render: (r) => <span className="text-muted-foreground">{r.device}</span> },
  { key: "tech", header: "Technician", render: (r) => r.tech },
  { key: "cost", header: "Quote", render: (r) => <span className="tabular-nums">{currency(r.cost)}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminDashboard() {
  return (
    <DashShell
      groups={adminNav}
      workspace="Admin console"
      user={{ name: "Bora Tep", email: "bora@twintech.dev", initials: "BT" }}
      breadcrumb={["TwinTech", "Admin", "Dashboard"]}
    >
      <PageHeader
        title="Operations overview"
        description="Four branches · July 2026 to date"
        actions={<Button variant="outline">Export report</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue MTD" value={currency(146300)} delta={10} hint="vs June" icon={DollarSign} tone="success" />
        <StatCard label="Orders" value="512" delta={9} hint="94% fulfilled" icon={ShoppingBag} />
        <StatCard label="Repairs in queue" value="38" delta={-4} hint="Avg 2.1 days" icon={Wrench} tone="warning" />
        <StatCard label="Low stock SKUs" value="3" hint="2 out of stock" icon={Boxes} tone="danger" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard title="Revenue vs repair income" description="Trailing seven months">
          <RevenueAreaChart data={revenueSeries} />
        </ChartCard>
        <ChartCard title="Payment channels" description="Share of settled volume">
          <ChannelPieChart data={channelSplit} />
        </ChartCard>
      </div>
      <ChartCard title="Top products by units" description="Units sold this quarter">
        <BarsChart data={topProducts} dataKey="units" labelKey="name" />
      </ChartCard>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Repair queue</h2>
        <DataTable
          rows={repairJobs}
          columns={columns}
          searchKeys={["id", "customer", "device"]}
          filter={{
            label: "Status",
            key: "status",
            options: ["Received", "Diagnosing", "Awaiting parts", "In repair", "Quality check", "Ready", "Completed"],
          }}
          rowKey="id"
        />
      </div>
    </DashShell>
  );
}
