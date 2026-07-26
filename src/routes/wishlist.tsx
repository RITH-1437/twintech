import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currency, products } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({
  head: seo(
    "Wishlist — TwinTech Store",
    "Saved laptops, desktops and components with live stock and price-drop alerts from TwinTech.",
  ),
  component: WishlistPage,
});

function WishlistPage() {
  const [saved, setSaved] = useState(products.slice(1, 5).map((p) => p.id));
  const items = products.filter((p) => saved.includes(p.id));

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <PageHeader
          title="Wishlist"
          description="We'll alert you when a saved item drops in price or returns to stock."
          actions={
            <Button variant="outline" asChild>
              <Link to="/products">Browse catalog</Link>
            </Button>
          }
        />
        {items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Heart}
              title="No saved items"
              description="Tap the heart on any product to keep an eye on stock and pricing."
              action={
                <Button asChild>
                  <Link to="/products">Find hardware</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => (
              <div key={p.id} className="surface-panel hover-lift flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={p.stock > 0 ? "soft" : "outline"}>
                    {p.stock > 0 ? "In stock" : "Out of stock"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${p.name} from wishlist`}
                    onClick={() => setSaved((s) => s.filter((id) => id !== p.id))}
                  >
                    <Heart className="size-4 fill-destructive text-destructive" />
                  </Button>
                </div>
                <Link
                  to="/products/$productId"
                  params={{ productId: p.id }}
                  className="mt-4 text-sm font-semibold text-foreground hover:text-primary"
                >
                  {p.name}
                </Link>
                <p className="mt-1 flex-1 text-xs text-muted-foreground">{p.specs.cpu}</p>
                <p className="mt-4 text-lg font-semibold tabular-nums text-foreground">
                  {currency(p.price)}
                </p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => toast.success(`${p.name} added to cart`)}
                >
                  <ShoppingCart /> Add to cart
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
