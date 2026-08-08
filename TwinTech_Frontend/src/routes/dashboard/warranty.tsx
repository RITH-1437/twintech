import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { CustomerPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { customerWarranty } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/warranty")({
  head: seo(
    "Warranty coverage — TwinTech",
    "Every TwinTech device you own with serial-level warranty windows, claim history and one-click claim filing.",
  ),
  component: CustomerWarrantyPage,
});

type Row = (typeof customerWarranty)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Claim ref", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "device", header: "Device", render: (r) => r.device },
  { key: "serial", header: "Serial", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.serial}</span> },
  { key: "purchased", header: "Purchased", render: (r) => <span className="text-muted-foreground">{r.purchased}</span> },
  { key: "coverage", header: "Coverage", render: (r) => r.coverage },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function CustomerWarrantyPage() {
  return (
    <CustomerPage
      title="Warranty"
      description="Serial-level coverage across every device you bought from TwinTech."
      actions={<Button>File a claim</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Devices covered" value="2" hint="Of 3 registered" icon={ShieldCheck} tone="success" />
        <StatCard label="Expiring soon" value="0" hint="Next 90 days" icon={ShieldCheck} />
        <StatCard label="Expired" value="1" hint="Renew available" icon={ShieldCheck} tone="warning" />
      </div>
      <DataTable rows={customerWarranty} columns={columns} searchKeys={["device", "serial", "id"]} rowKey="id" />
    </CustomerPage>
  );
}