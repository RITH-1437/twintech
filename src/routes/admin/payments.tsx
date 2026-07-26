import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, DollarSign, TrendingDown, Wallet } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ChannelPieChart, ChartCard } from "@/components/shared/charts";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { channelSplit, currency, currencyPrecise, transactions } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/payments")({
  head: seo(
    "Payments — TwinTech Admin",
    "Reconcile ABA PayWay, KHQR and card settlements with fees, refunds and failed-charge retries.",
  ),
  component: AdminPayments,
});

type Row = (typeof transactions)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Reference", render: (r) => <span className="font-mono text-xs font-medium text-foreground">{r.id}</span> },
  { key: "order", header: "Order", render: (r) => <span className="text-muted-foreground">{r.order}</span> },
  { key: "channel", header: "Channel", render: (r) => r.channel },
  { key: "amount", header: "Amount", render: (r) => <span className="tabular-nums">{currency(r.amount)}</span> },
  { key: "fee", header: "Fee", render: (r) => <span className="tabular-nums text-muted-foreground">{currencyPrecise(r.fee)}</span> },
  { key: "at", header: "Time", render: (r) => <span className="text-muted-foreground">{r.at}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminPayments() {
  return (
    <AdminPage
      title="Payments"
      description="Settlement window closes daily at 23:00 ICT."
      actions={<Button variant="outline">Export ledger</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Settled today" value={currency(5555)} delta={12} hint="3 payments" icon={DollarSign} tone="success" />
        <StatCard label="Pending" value={currency(718)} hint="1 authorisation" icon={Wallet} tone="warning" />
        <StatCard label="Fees" value={currencyPrecise(62.73)} hint="1% blended" icon={CreditCard} />
        <StatCard label="Failed / refunded" value="2" delta={-1} hint="Retry sent" icon={TrendingDown} tone="danger" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px] xl:items-start">
        <DataTable
          rows={transactions}
          columns={columns}
          searchKeys={["id", "order", "channel"]}
          filter={{ label: "Status", key: "status", options: ["Settled", "Pending", "Refunded", "Failed"] }}
          rowKey="id"
        />
        <ChartCard title="Channel mix" description="Share of settled value">
          <ChannelPieChart data={channelSplit} />
        </ChartCard>
      </div>
    </AdminPage>
  );
}