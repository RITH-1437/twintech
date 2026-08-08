import { createFileRoute } from "@tanstack/react-router";
import { FileText, Receipt, Undo2 } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, invoicesList } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/invoices")({
  head: seo(
    "Invoicing — TwinTech Admin",
    "Issue, chase and reconcile customer invoices with due dates, credit notes and payment status.",
  ),
  component: AdminInvoices,
});

type Row = (typeof invoicesList)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Invoice", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "customer", header: "Customer", render: (r) => r.customer },
  { key: "order", header: "Order", render: (r) => <span className="text-muted-foreground">{r.order}</span> },
  { key: "issued", header: "Issued", render: (r) => r.issued },
  { key: "due", header: "Due", render: (r) => <span className="text-muted-foreground">{r.due}</span> },
  { key: "amount", header: "Amount", render: (r) => <span className="tabular-nums">{currency(r.amount)}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminInvoices() {
  return (
    <AdminPage title="Invoicing" description="Issued automatically on payment capture." actions={<Button>Create invoice</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Invoiced MTD" value={currency(10394)} delta={10} hint="6 documents" icon={Receipt} tone="success" />
        <StatCard label="Outstanding" value={currency(1686)} hint="2 invoices" icon={FileText} tone="warning" />
        <StatCard label="Credit notes" value={currency(189)} hint="1 refund" icon={Undo2} tone="danger" />
      </div>
      <DataTable
        rows={invoicesList}
        columns={columns}
        searchKeys={["id", "customer", "order"]}
        filter={{ label: "Status", key: "status", options: ["Paid", "Pending", "Refunded"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}