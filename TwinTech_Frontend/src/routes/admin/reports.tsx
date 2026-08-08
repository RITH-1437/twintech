import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { reportsList } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/reports")({
  head: seo(
    "Reports — TwinTech Admin",
    "Schedule and export revenue, inventory valuation, SLA and settlement reports in PDF, CSV or XLSX.",
  ),
  component: AdminReports,
});

type Row = (typeof reportsList)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Report", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "scope", header: "Scope", render: (r) => <span className="text-muted-foreground">{r.scope}</span> },
  { key: "period", header: "Period", render: (r) => r.period },
  { key: "format", header: "Format", render: (r) => <span className="font-mono text-xs">{r.format}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "action",
    header: "",
    render: () => (
      <Button variant="ghost" size="sm">
        <Download className="size-3.5" /> Download
      </Button>
    ),
  },
];

function AdminReports() {
  return (
    <AdminPage
      title="Reports"
      description="Generated overnight, retained for 24 months."
      actions={<Button>New report</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Reports ready" value="3" hint="This period" icon={FileText} tone="success" />
        <StatCard label="Scheduled" value="6" hint="Weekly + monthly" icon={FileText} />
        <StatCard label="In queue" value="2" hint="Running now" icon={FileText} tone="warning" />
      </div>
      <DataTable
        rows={reportsList}
        columns={columns}
        searchKeys={["name", "scope"]}
        filter={{ label: "Status", key: "status", options: ["Completed", "Processing", "Pending"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}