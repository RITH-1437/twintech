import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CalendarDays, Clock } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { appointments } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/appointments")({
  head: seo(
    "Appointments — TwinTech Admin",
    "Branch service calendar with technician assignment, slot capacity and booking confirmations.",
  ),
  component: AdminAppointments,
});

type Row = (typeof appointments)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Booking", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "customer", header: "Customer", render: (r) => r.customer },
  { key: "service", header: "Service", render: (r) => <span className="text-muted-foreground">{r.service}</span> },
  { key: "branch", header: "Branch", render: (r) => r.branch },
  { key: "tech", header: "Technician", render: (r) => r.tech },
  { key: "slot", header: "Slot", render: (r) => <span className="tabular-nums">{r.slot}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminAppointments() {
  return (
    <AdminPage title="Appointments" description="Next 7 days across four service counters." actions={<Button>Book slot</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Booked this week" value="24" delta={8} hint="78% capacity" icon={CalendarDays} />
        <StatCard label="Confirmed today" value="2" hint="1 awaiting confirmation" icon={CalendarCheck} tone="success" />
        <StatCard label="Avg wait to slot" value="1.4 days" delta={-11} hint="Improving" icon={Clock} tone="warning" />
      </div>
      <DataTable
        rows={appointments}
        columns={columns}
        searchKeys={["id", "customer", "service", "branch"]}
        filter={{ label: "Status", key: "status", options: ["Approved", "Pending", "Processing", "Cancelled"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}