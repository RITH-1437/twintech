import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Receipt, Wallet } from "lucide-react";
import { CustomerPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ChartCard, ChannelPieChart } from "@/components/shared/charts";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { channelSplit, currency, customerPayments, payWayPayments } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/payments")({
  head: seo(
    "Payment history — TwinTech",
    "Every TwinTech payment, refund and settlement across ABA PayWay, KHQR and card, with downloadable receipts.",
  ),
  component: CustomerPayments,
});

type Row = (typeof customerPayments)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Reference", render: (r) => <span className="font-mono text-xs font-medium text-foreground">{r.id}</span> },
  { key: "order", header: "Order", render: (r) => <span className="text-muted-foreground">{r.order}</span> },
  { key: "method", header: "Method", render: (r) => r.method },
  { key: "at", header: "Date", render: (r) => <span className="text-muted-foreground">{r.at}</span> },
  { key: "amount", header: "Amount", render: (r) => <span className="tabular-nums">{currency(r.amount)}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "receipt",
    header: "Receipt",
    className: "text-right",
    render: (r) => {
      const tran = payWayPayments.find((p) => p.order === r.order)?.tran ?? payWayPayments[0].tran;
      return (
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard/receipt/$id" params={{ id: tran }}>
            <Receipt /> View
          </Link>
        </Button>
      );
    },
  },
];

function CustomerPayments() {
  return (
    <CustomerPage
      title="Payment history"
      crumb="Payment history"
      description="Settlements post within seconds of an ABA PayWay confirmation."
      actions={<Button variant="outline">Manage payment methods</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Paid this year" value={currency(4297)} delta={14} hint="4 payments" icon={Wallet} tone="success" />
        <StatCard label="Refunded" value={currency(3260)} hint="1 return" icon={CreditCard} tone="danger" />
        <StatCard label="Saved methods" value="2" hint="ABA PayWay, KHQR" icon={CreditCard} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
        <DataTable
          rows={customerPayments}
          columns={columns}
          searchKeys={["id", "order", "method"]}
          filter={{ label: "Status", key: "status", options: ["Settled", "Refunded"] }}
          rowKey="id"
        />
        <ChartCard title="How you pay" description="Share of your payments by channel">
          <ChannelPieChart data={channelSplit} />
        </ChartCard>
      </div>
    </CustomerPage>
  );
}