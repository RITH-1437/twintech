import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck, Timer } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { warrantyClaims } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/warranty")({
  head: seo(
    "Warranty claims — TwinTech Admin",
    "Serial-level warranty claim queue with coverage windows, approval status and resolution times.",
  ),
  component: AdminWarranty,
});

type Row = (typeof warrantyClaims)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Claim", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "customer", header: "Customer", render: (r) => r.customer },
  { key: "device", header: "Device", render: (r) => <span className="text-muted-foreground">{r.device}</span> },
  { key: "serial", header: "Serial", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.serial}</span> },
  { key: "opened", header: "Opened", render: (r) => r.opened },
  { key: "coverage", header: "Coverage", render: (r) => r.coverage },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminWarranty() {
  return (
    <AdminPage title="Warranty claims" description="Claims raised against serial-tracked units." actions={<Button>New claim</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open claims" value="2" hint="1 needs parts" icon={ShieldAlert} tone="warning" />
        <StatCard label="Approved" value="2" delta={9} hint="Last 30 days" icon={ShieldCheck} tone="success" />
        <StatCard label="Avg resolution" value="3.4 days" delta={-8} hint="Target 5 days" icon={Timer} />
      </div>
      <DataTable
        rows={warrantyClaims}
        columns={columns}
        searchKeys={["id", "customer", "device", "serial"]}
        filter={{ label: "Status", key: "status", options: ["Processing", "Approved", "Completed", "Expired"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}