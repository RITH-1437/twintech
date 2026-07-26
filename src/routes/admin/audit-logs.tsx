import { createFileRoute } from "@tanstack/react-router";
import { Activity, ShieldAlert, Users } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { auditLogs } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/audit-logs")({
  head: seo(
    "Audit logs — TwinTech Admin",
    "Signed, immutable record of every staff and system action with actor, target and IP address.",
  ),
  component: AdminAuditLogs,
});

type Row = (typeof auditLogs)[number];

const columns: Column<Row>[] = [
  { key: "at", header: "When", render: (r) => <span className="tabular-nums text-muted-foreground">{r.at}</span> },
  { key: "actor", header: "Actor", render: (r) => <span className="font-medium text-foreground">{r.actor}</span> },
  { key: "action", header: "Action", render: (r) => r.action },
  { key: "target", header: "Target", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.target}</span> },
  { key: "ip", header: "IP", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.ip}</span> },
  { key: "severity", header: "Result", render: (r) => <StatusBadge status={r.severity} /> },
];

function AdminAuditLogs() {
  return (
    <AdminPage title="Audit logs" description="Retained 24 months · export is cryptographically signed." actions={<Button variant="outline">Export log</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Events today" value="184" delta={6} hint="Across 5 actors" icon={Activity} />
        <StatCard label="Unique actors" value="5" hint="Incl. system" icon={Users} />
        <StatCard label="Failures" value="1" hint="Payment webhook" icon={ShieldAlert} tone="danger" />
      </div>
      <DataTable
        rows={auditLogs}
        columns={columns}
        searchKeys={["actor", "action", "target", "ip"]}
        filter={{ label: "Result", key: "severity", options: ["Active", "Pending", "Failed"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}