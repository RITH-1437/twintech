import { createFileRoute } from "@tanstack/react-router";
import { BadgePercent, Ticket, TrendingUp } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { coupons } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/coupons")({
  head: seo(
    "Coupons — TwinTech Admin",
    "Create and monitor discount codes with redemption caps, expiry dates and live usage tracking.",
  ),
  component: AdminCoupons,
});

type Row = (typeof coupons)[number];

const columns: Column<Row>[] = [
  { key: "code", header: "Code", render: (r) => <span className="font-mono text-xs font-semibold text-foreground">{r.code}</span> },
  { key: "type", header: "Type", render: (r) => <span className="text-muted-foreground">{r.type}</span> },
  { key: "value", header: "Value", render: (r) => r.value },
  {
    key: "uses",
    header: "Redemptions",
    render: (r) => (
      <div className="min-w-28">
        <p className="text-xs tabular-nums text-muted-foreground">{r.uses} / {r.cap}</p>
        <Progress value={(r.uses / r.cap) * 100} className="mt-1.5 h-1.5" />
      </div>
    ),
  },
  { key: "expires", header: "Expires", render: (r) => <span className="text-muted-foreground">{r.expires}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminCoupons() {
  return (
    <AdminPage title="Coupons" description="Promotions applied at checkout and in-store." actions={<Button>New coupon</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active codes" value="3" hint="2 expiring soon" icon={Ticket} tone="success" />
        <StatCard label="Redemptions" value="870" delta={18} hint="Last 90 days" icon={BadgePercent} />
        <StatCard label="Discount given" value="$12,480" delta={9} hint="4.1% of revenue" icon={TrendingUp} tone="warning" />
      </div>
      <DataTable
        rows={coupons}
        columns={columns}
        searchKeys={["code", "type"]}
        filter={{ label: "Status", key: "status", options: ["Active", "Expired"] }}
        rowKey="code"
      />
    </AdminPage>
  );
}