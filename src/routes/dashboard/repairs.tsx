import { createFileRoute } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/dash-shell";
import { customerNav } from "@/components/dash/nav-config";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { RepairTimeline } from "@/components/shared/repair-timeline";
import { DataTable, type Column } from "@/components/shared/data-table";
import { currency, repairJobs, timeline } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/repairs")({
  head: seo(
    "My repair requests — TwinTech",
    "Follow every TwinTech repair job: diagnostics, quotes, parts status and handover, timestamped end to end.",
  ),
  component: CustomerRepairs,
});

type Job = (typeof repairJobs)[number];

const columns: Column<Job>[] = [
  { key: "id", header: "Job", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "device", header: "Device", render: (r) => r.device },
  { key: "issue", header: "Issue", render: (r) => <span className="text-muted-foreground">{r.issue}</span> },
  { key: "cost", header: "Quote", render: (r) => <span className="tabular-nums">{currency(r.cost)}</span> },
  { key: "due", header: "Due", render: (r) => <span className="text-muted-foreground">{r.due}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function CustomerRepairs() {
  return (
    <DashShell
      groups={customerNav}
      workspace="Customer portal"
      user={{ name: "Sokha Chan", email: "sokha@twintech.dev", initials: "SC" }}
      breadcrumb={["TwinTech", "Dashboard", "Repair requests"]}
    >
      <PageHeader title="Repair requests" description="Every job you've booked, with live status." />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
        <DataTable
          rows={repairJobs}
          columns={columns}
          searchKeys={["id", "device", "issue"]}
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
    </DashShell>
  );
}
