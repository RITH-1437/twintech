import { createFileRoute } from "@tanstack/react-router";
import { Clock, Timer, Wrench } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { RepairTimeline } from "@/components/shared/repair-timeline";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, repairJobs, timeline } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/repairs")({
  head: seo(
    "Repair jobs — TwinTech Admin",
    "Service desk queue with technician assignment, quotes, parts status and SLA due dates.",
  ),
  component: AdminRepairs,
});

type Row = (typeof repairJobs)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Job", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "customer", header: "Customer", render: (r) => r.customer },
  { key: "device", header: "Device", render: (r) => <span className="text-muted-foreground">{r.device}</span> },
  { key: "tech", header: "Technician", render: (r) => r.tech },
  { key: "priority", header: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
  { key: "cost", header: "Quote", render: (r) => <span className="tabular-nums">{currency(r.cost)}</span> },
  { key: "due", header: "Due", render: (r) => <span className="text-muted-foreground">{r.due}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminRepairs() {
  return (
    <AdminPage title="Repair jobs" description="Live service desk queue across all branches." actions={<Button>New intake</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Jobs in queue" value="38" delta={-4} hint="6 high priority" icon={Wrench} tone="warning" />
        <StatCard label="Avg turnaround" value="2.1 days" delta={-12} hint="Target 3 days" icon={Timer} tone="success" />
        <StatCard label="Awaiting parts" value="7" hint="Longest 4 days" icon={Clock} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px] xl:items-start">
        <DataTable
          rows={repairJobs}
          columns={columns}
          searchKeys={["id", "customer", "device", "tech"]}
          filter={{
            label: "Status",
            key: "status",
            options: ["Diagnosing", "Awaiting parts", "In repair", "Quality check", "Ready", "Completed"],
          }}
          rowKey="id"
        />
        <div className="surface-panel p-5">
          <h2 className="text-sm font-semibold text-foreground">RPR-2481 timeline</h2>
          <p className="mt-1 mb-5 text-xs text-muted-foreground">MacBook Pro 14 M3 · Vireak S.</p>
          <RepairTimeline steps={timeline} />
        </div>
      </div>
    </AdminPage>
  );
}