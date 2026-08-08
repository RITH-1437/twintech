import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserCog, Users } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { employees } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/employees")({
  head: seo(
    "Employees & roles — TwinTech Admin",
    "Staff directory with role-based permissions, team assignment and account status controls.",
  ),
  component: AdminEmployees,
});

type Row = (typeof employees)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Employee", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "role", header: "Role", render: (r) => r.role },
  { key: "team", header: "Team", render: (r) => <Badge variant="soft">{r.team}</Badge> },
  { key: "jobs", header: "Jobs closed", render: (r) => <span className="tabular-nums">{r.jobs}</span> },
  { key: "rating", header: "Rating", render: (r) => <span className="tabular-nums">{r.rating}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminEmployees() {
  return (
    <AdminPage
      title="Employees & roles"
      crumb="Employees"
      description="Role-based access across retail, warehouse and service teams."
      actions={<Button>Invite employee</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Staff accounts" value={String(employees.length)} hint="4 active" icon={Users} />
        <StatCard label="Roles defined" value="6" hint="Least-privilege defaults" icon={UserCog} />
        <StatCard label="2FA enabled" value="100%" delta={20} hint="Enforced org-wide" icon={ShieldCheck} tone="success" />
      </div>
      <DataTable
        rows={employees}
        columns={columns}
        searchKeys={["name", "role", "team"]}
        filter={{ label: "Team", key: "team", options: ["Repairs", "Warehouse", "Retail"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}