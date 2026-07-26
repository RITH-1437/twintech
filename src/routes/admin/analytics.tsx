import { createFileRoute } from "@tanstack/react-router";
import { Activity, DollarSign, ShoppingBag, Users } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { BarsChart, ChannelPieChart, ChartCard, RevenueAreaChart, TrendLineChart } from "@/components/shared/charts";
import { Button } from "@/components/ui/button";
import { channelSplit, currency, revenueSeries, topProducts } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/analytics")({
  head: seo(
    "Analytics — TwinTech Admin",
    "Revenue trends, repair income, channel mix and product performance across every TwinTech branch.",
  ),
  component: AdminAnalytics,
});

function AdminAnalytics() {
  return (
    <AdminPage
      title="Analytics"
      description="Rolling 7-month view · updated hourly"
      actions={<Button variant="outline">Export CSV</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={currency(774100)} delta={16} hint="Year to date" icon={DollarSign} tone="success" />
        <StatCard label="Orders" value="2,805" delta={11} hint="Avg $276 basket" icon={ShoppingBag} />
        <StatCard label="New customers" value="418" delta={7} hint="34% business tier" icon={Users} />
        <StatCard label="Repair attach rate" value="27%" delta={3} hint="Of hardware sales" icon={Activity} tone="warning" />
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <ChartCard className="xl:col-span-2" title="Revenue vs repair income" description="Monthly, USD">
          <RevenueAreaChart data={revenueSeries} />
        </ChartCard>
        <ChartCard title="Payment channels" description="Share of settled value">
          <ChannelPieChart data={channelSplit} />
        </ChartCard>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Top products" description="Units sold, year to date">
          <BarsChart data={topProducts} dataKey="units" labelKey="name" />
        </ChartCard>
        <ChartCard title="Order volume" description="Orders per month">
          <TrendLineChart data={revenueSeries} dataKey="orders" />
        </ChartCard>
      </div>
    </AdminPage>
  );
}