import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, UserPlus, Users } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currency, customersList } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/customers")({
  head: seo(
    "Customers — TwinTech Admin",
    "Customer directory with tiers, lifetime spend, order counts and service history in one record.",
  ),
  component: AdminCustomers,
});

type Row = (typeof customersList)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Customer", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "email", header: "Email", render: (r) => <span className="text-muted-foreground">{r.email}</span> },
  { key: "tier", header: "Tier", render: (r) => <Badge variant="soft">{r.tier}</Badge> },
  { key: "orders", header: "Orders", render: (r) => <span className="tabular-nums">{r.orders}</span> },
  { key: "spend", header: "Lifetime spend", render: (r) => <span className="tabular-nums">{currency(r.spend)}</span> },
  { key: "joined", header: "Since", render: (r) => <span className="text-muted-foreground">{r.joined}</span> },
];

function AdminCustomers() {
  return (
    <AdminPage title="Customers" description="Retail, business and enterprise accounts." actions={<Button>Add customer</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total customers" value="1,284" delta={7} hint="418 new this year" icon={Users} />
        <StatCard label="Business & enterprise" value="212" delta={12} hint="62% of revenue" icon={HeartHandshake} tone="success" />
        <StatCard label="New this month" value="38" delta={4} hint="Retail led" icon={UserPlus} />
      </div>
      <DataTable
        rows={customersList}
        columns={columns}
        searchKeys={["name", "email", "id"]}
        filter={{ label: "Tier", key: "tier", options: ["Retail", "Business", "Enterprise"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}