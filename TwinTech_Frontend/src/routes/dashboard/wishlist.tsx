import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { CustomerPage } from "@/components/dash/workspace-page";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { currency, products } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/wishlist")({
  head: seo(
    "Saved items — TwinTech dashboard",
    "Your saved TwinTech machines and parts with live pricing, stock status and one-tap add to cart.",
  ),
  component: DashboardWishlist,
});

function DashboardWishlist() {
  const saved = products.slice(0, 4);
  return (
    <CustomerPage
      title="Saved items"
      crumb="Wishlist"
      description="Watch prices and stock on the builds you're considering."
      actions={
        <Button asChild variant="outline">
          <Link to="/wishlist">Open full wishlist</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {saved.map((p) => (
          <article key={p.id} className="surface-panel hover-lift flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
              <Heart className="size-4 shrink-0 fill-destructive text-destructive" />
            </div>
            <p className="text-lg font-semibold tabular-nums text-foreground">{currency(p.price)}</p>
            <StatusBadge status={p.stock > 0 ? "Healthy" : "Out"} />
            <div className="mt-auto flex gap-2 pt-2">
              <Button size="sm" className="flex-1">Add to cart</Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/products/$productId" params={{ productId: p.id }}>View</Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </CustomerPage>
  );
}