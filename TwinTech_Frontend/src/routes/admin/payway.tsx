import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Download,
  Landmark,
  RefreshCw,
  ScanLine,
  Send,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ChartCard, TrendLineChart } from "@/components/shared/charts";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  currency,
  currencyPrecise,
  payWayBatches,
  payWayPayments,
  payWayVolume,
  payWayWebhooks,
} from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/payway")({
  head: seo(
    "ABA PayWay tracking — TwinTech Admin",
    "Track ABA PayWay and KHQR transactions, settlement batches, payout variance and webhook callbacks in one ledger.",
  ),
  component: AdminPayWay,
});

type PaymentRow = (typeof payWayPayments)[number];
type BatchRow = (typeof payWayBatches)[number];
type HookRow = (typeof payWayWebhooks)[number];

const paymentColumns: Column<PaymentRow>[] = [
  { key: "tran", header: "PayWay ref", render: (r) => <span className="font-mono text-xs font-medium text-foreground">{r.tran}</span> },
  { key: "order", header: "Order", render: (r) => <span className="text-muted-foreground">{r.order}</span> },
  { key: "customer", header: "Customer", render: (r) => r.customer },
  { key: "method", header: "Method", render: (r) => <Badge variant="soft">{r.method}</Badge> },
  { key: "amount", header: "Amount", render: (r) => <span className="tabular-nums">{currency(r.amount)}</span> },
  { key: "fee", header: "Fee", render: (r) => <span className="tabular-nums text-muted-foreground">{currencyPrecise(r.fee)}</span> },
  { key: "net", header: "Net", render: (r) => <span className="tabular-nums">{currencyPrecise(r.net)}</span> },
  { key: "batch", header: "Batch", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.batch}</span> },
  { key: "at", header: "Captured", render: (r) => <span className="text-muted-foreground">{r.at}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

const batchColumns: Column<BatchRow>[] = [
  { key: "batch", header: "Batch", render: (r) => <span className="font-mono text-xs font-medium text-foreground">{r.batch}</span> },
  { key: "window", header: "Capture window", render: (r) => <span className="text-muted-foreground">{r.window}</span> },
  { key: "count", header: "Txns", render: (r) => <span className="tabular-nums">{r.count}</span> },
  { key: "gross", header: "Gross", render: (r) => <span className="tabular-nums">{currency(r.gross)}</span> },
  { key: "fees", header: "Fees", render: (r) => <span className="tabular-nums text-muted-foreground">{currencyPrecise(r.fees)}</span> },
  { key: "expected", header: "Expected payout", render: (r) => <span className="tabular-nums">{currencyPrecise(r.expected)}</span> },
  {
    key: "variance",
    header: "Variance",
    render: (r) => {
      const diff = r.posted - r.expected;
      return (
        <span className={diff === 0 ? "tabular-nums text-muted-foreground" : "tabular-nums font-medium text-destructive"}>
          {diff === 0 ? "Matched" : currencyPrecise(diff)}
        </span>
      );
    },
  },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

const webhookColumns: Column<HookRow>[] = [
  { key: "id", header: "Event ID", render: (r) => <span className="font-mono text-xs font-medium text-foreground">{r.id}</span> },
  { key: "event", header: "Type", render: (r) => <span className="font-mono text-xs">{r.event}</span> },
  { key: "tran", header: "PayWay ref", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.tran}</span> },
  {
    key: "code",
    header: "Response",
    render: (r) => (
      <span className={r.code === 200 ? "tabular-nums text-muted-foreground" : "tabular-nums font-medium text-destructive"}>
        {r.code}
      </span>
    ),
  },
  { key: "attempts", header: "Attempts", render: (r) => <span className="tabular-nums">{r.attempts}</span> },
  { key: "at", header: "Received", render: (r) => <span className="text-muted-foreground">{r.at}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminPayWay() {
  return (
    <AdminPage
      title="ABA PayWay"
      crumb="ABA PayWay"
      description="Merchant TWINTECH_KH · settlement window closes daily at 23:00 ICT."
      actions={
        <>
          <Button variant="outline">
            <Download /> Export ledger
          </Button>
          <Button>
            <RefreshCw /> Sync with PayWay
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Captured today" value={currency(4587)} delta={12} hint="2 transactions" icon={ScanLine} tone="success" />
        <StatCard label="Awaiting settlement" value={currency(718)} hint="1 authorisation" icon={Wallet} tone="warning" />
        <StatCard label="Payout variance" value={currencyPrecise(-45)} hint="Batch PWB-2606-29" icon={Landmark} tone="danger" />
        <StatCard label="Callback failures" value="1" hint="Retry queued" icon={TriangleAlert} tone="danger" />
      </div>

      <Tabs defaultValue="ledger">
        <TabsList>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="webhooks">Callbacks</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="mt-5 space-y-5">
          <DataTable
            rows={payWayPayments}
            columns={paymentColumns}
            searchKeys={["tran", "order", "customer", "method", "batch"]}
            filter={{ label: "Status", key: "status", options: ["Settled", "Pending", "Refunded", "Failed"] }}
            rowKey="tran"
            pageSize={6}
            recordLabel="transactions"
            bulkActions={[
              { label: "Capture now", icon: Check, run: (ids) => `Capture requested for ${ids.length} transactions` },
              { label: "Send receipt", icon: Send, run: (ids) => `Receipts emailed for ${ids.length} transactions` },
              { label: "Export selection", icon: Download },
              { label: "Refund", icon: RefreshCw, confirm: true, destructive: true, run: (ids) => `${ids.length} refunds submitted to PayWay` },
            ]}
          />
          <ChartCard title="PayWay volume" description="Monthly captured value through ABA">
            <TrendLineChart data={payWayVolume} dataKey="volume" />
          </ChartCard>
        </TabsContent>

        <TabsContent value="reconciliation" className="mt-5">
          <DataTable
            rows={payWayBatches}
            columns={batchColumns}
            searchKeys={["batch", "window"]}
            filter={{ label: "Status", key: "status", options: ["Settled", "Pending", "Failed"] }}
            rowKey="batch"
            recordLabel="batches"
            bulkActions={[
              { label: "Mark reconciled", icon: Check, run: (ids) => `${ids.length} batches marked reconciled` },
              { label: "Re-fetch payout", icon: RefreshCw },
              { label: "Export selection", icon: Download },
            ]}
            emptyTitle="No settlement batches"
            emptyDescription="Batches appear once PayWay closes a capture window."
          />
        </TabsContent>

        <TabsContent value="webhooks" className="mt-5">
          <DataTable
            rows={payWayWebhooks}
            columns={webhookColumns}
            searchKeys={["id", "event", "tran"]}
            filter={{ label: "Status", key: "status", options: ["Completed", "Processing", "Failed"] }}
            rowKey="id"
            recordLabel="callbacks"
            bulkActions={[
              { label: "Replay callback", icon: RefreshCw, run: (ids) => `${ids.length} callbacks replayed` },
              { label: "Export payloads", icon: Download },
              { label: "Discard", icon: TriangleAlert, confirm: true, destructive: true },
            ]}
            emptyTitle="No callbacks received"
            emptyDescription="PayWay posts a callback for every capture, refund and failure."
          />
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}