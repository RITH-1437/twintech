import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Package, Star, Tag } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { currency, products } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/products")({
  head: seo(
    "Products — TwinTech Admin",
    "Manage the TwinTech catalogue: pricing, SKUs, categories, stock levels and storefront visibility.",
  ),
  component: AdminProducts,
});

type Row = (typeof products)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Product", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "sku", header: "SKU", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.sku}</span> },
  { key: "category", header: "Category", render: (r) => r.category },
  { key: "price", header: "Price", render: (r) => <span className="tabular-nums">{currency(r.price)}</span> },
  { key: "stock", header: "Stock", render: (r) => <span className="tabular-nums">{r.stock}</span> },
  { key: "rating", header: "Rating", render: (r) => <span className="tabular-nums">{r.rating.toFixed(1)}</span> },
  {
    key: "state",
    header: "Status",
    render: (r) => <StatusBadge status={r.stock === 0 ? "Out" : r.stock < 6 ? "Low" : "Healthy"} />,
  },
  {
    key: "action",
    header: "",
    render: (r) => (
      <Button asChild variant="ghost" size="sm">
        <Link to="/products/$productId" params={{ productId: r.id }}>View</Link>
      </Button>
    ),
  },
];

function AdminProducts() {
  return (
    <AdminPage
      title="Products"
      description="Catalogue synced to the storefront in real time."
      actions={<Button>Add product</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active SKUs" value={String(products.length)} delta={4} hint="Published" icon={Package} />
        <StatCard label="Categories" value="6" hint="Laptops to peripherals" icon={Boxes} />
        <StatCard label="Avg rating" value="4.7" delta={2} hint="Across 1,240 reviews" icon={Star} tone="success" />
        <StatCard label="On promotion" value="3" hint="Coupon eligible" icon={Tag} tone="warning" />
      </div>
      <DataTable
        rows={products}
        columns={columns}
        searchKeys={["name", "sku", "brand"]}
        filter={{ label: "Category", key: "category", options: ["Laptops", "Desktops", "Monitors", "Peripherals", "Storage", "Components"] }}
        rowKey="id"
      />
    </AdminPage>
  );
}