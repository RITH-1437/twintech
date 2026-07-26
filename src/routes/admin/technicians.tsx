import { createFileRoute } from "@tanstack/react-router";
import { Star, Users, Wrench } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { BarsChart, ChartCard } from "@/components/shared/charts";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { employees } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/technicians")({
  head: seo(
    "Technicians — TwinTech Admin",
    "Technician workload, completed job counts, customer ratings and availability across service branches.",
  ),
  component: AdminTechnicians,
});

const techs = employees.filter((e) => e.team === "Repairs");
type Row = (typeof techs)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Technician", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "role", header: "Role", render: (r) => <span className="text-muted-foreground">{r.role}</span> },
  { key: "jobs", header: "Jobs closed", render: (r) => <span className="tabular-nums">{r.jobs}</span> },
  {
    key: "rating",
    header: "Rating",
    render: (r) => (
      <span className="inline-flex items-center gap-1 tabular-nums">
        <Star className="size-3.5 fill-warning text-warning" />
        {r.rating}
      </span>
    ),
  },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminTechnicians() {
  return (
    <AdminPage title="Technicians" description="Service team capacity and quality." actions={<Button>Assign job</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Technicians" value={String(techs.length)} hint="2 available now" icon={Users} />
        <StatCard label="Jobs closed" value="298" delta={14} hint="Last 90 days" icon={Wrench} tone="success" />
        <StatCard label="Avg rating" value="4.8" delta={2} hint="Post-service survey" icon={Star} tone="success" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px] xl:items-start">
        <DataTable rows={techs} columns={columns} searchKeys={["name", "role"]} rowKey="id" />
        <ChartCard title="Workload" description="Jobs closed per technician">
          <BarsChart data={techs} dataKey="jobs" labelKey="name" />
        </ChartCard>
      </div>
    </AdminPage>
  );
}