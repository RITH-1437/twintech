import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { CustomerPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, invoicesList } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/invoices")({
  head: seo(
    "Invoices — TwinTech dashboard",
    "Download TwinTech invoices and receipts for every order, repair job and service contract you hold.",
  ),
  component: CustomerInvoices,
});

type Row = (typeof invoicesList)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Invoice", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "order", header: "Order", render: (r) => <span className="text-muted-foreground">{r.order}</span> },
  { key: "issued", header: "Issued", render: (r) => r.issued },
  { key: "due", header: "Due", render: (r) => <span className="text-muted-foreground">{r.due}</span> },
  { key: "amount", header: "Amount", render: (r) => <span className="tabular-nums">{currency(r.amount)}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function CustomerInvoices() {
  return (
    <CustomerPage
      title="Invoices"
      description="Tax-ready documents, issued the moment a payment settles."
      actions={<Button variant="outline">Download all (PDF)</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total invoiced" value={currency(10394)} delta={11} hint="Last 12 months" icon={FileText} />
        <StatCard label="Outstanding" value={currency(1686)} hint="2 invoices" icon={FileText} tone="warning" />
        <StatCard label="Credit notes" value={currency(189)} hint="1 refund" icon={FileText} tone="danger" />
      </div>
      <DataTable
        rows={invoicesList}
        columns={columns}
        searchKeys={["id", "order"]}
        filter={{ label: "Status", key: "status", options: ["Paid", "Pending", "Refunded"] }}
        rowKey="id"
      />
    </CustomerPage>
  );
}