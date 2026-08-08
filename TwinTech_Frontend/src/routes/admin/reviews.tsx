import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Star, ThumbsUp } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { productReviews } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/reviews")({
  head: seo(
    "Reviews — TwinTech Admin",
    "Moderate customer product reviews, approve pending feedback and track rating trends per SKU.",
  ),
  component: AdminReviews,
});

type Row = (typeof productReviews)[number];

const columns: Column<Row>[] = [
  { key: "product", header: "Product", render: (r) => <span className="font-medium text-foreground">{r.product}</span> },
  { key: "customer", header: "Customer", render: (r) => r.customer },
  {
    key: "rating",
    header: "Rating",
    render: (r) => (
      <span className="inline-flex items-center gap-1 tabular-nums">
        <Star className="size-3.5 fill-warning text-warning" />
        {r.rating}.0
      </span>
    ),
  },
  { key: "comment", header: "Comment", render: (r) => <span className="line-clamp-1 max-w-80 text-muted-foreground">{r.comment}</span> },
  { key: "date", header: "Date", render: (r) => <span className="text-muted-foreground">{r.date}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function AdminReviews() {
  return (
    <AdminPage title="Reviews" description="Moderation queue and rating health." actions={<Button variant="outline">Moderation rules</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Average rating" value="4.4" delta={3} hint="Across catalogue" icon={Star} tone="success" />
        <StatCard label="Pending review" value="2" hint="Awaiting moderation" icon={MessageSquare} tone="warning" />
        <StatCard label="Approved" value="3" delta={12} hint="Last 30 days" icon={ThumbsUp} />
      </div>
      <DataTable
        rows={productReviews}
        columns={columns}
        searchKeys={["product", "customer", "comment"]}
        filter={{ label: "Status", key: "status", options: ["Approved", "Pending"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}