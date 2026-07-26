import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { currencyPrecise, products } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: seo(
    "Your cart — TwinTech Store",
    "Review your TwinTech hardware selection, apply a coupon and continue to secure ABA PayWay checkout.",
  ),
  component: CartPage,
});

function CartPage() {
  const [lines, setLines] = useState(
    products.slice(0, 3).map((p, i) => ({ product: p, qty: i === 0 ? 1 : i })),
  );
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const items = lines.filter((l) => l.qty > 0);
  const subtotal = items.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 12;
  const tax = subtotal * 0.1;
  const total = Math.max(0, subtotal + shipping + tax - discount);

  const setQty = (id: string, delta: number) =>
    setLines((prev) =>
      prev.map((l) => (l.product.id === id ? { ...l, qty: Math.max(0, l.qty + delta) } : l)),
    );

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <PageHeader
          title="Your cart"
          description={`${items.length} item${items.length === 1 ? "" : "s"} ready for checkout`}
          actions={
            <Button variant="outline" asChild>
              <Link to="/products">Continue shopping</Link>
            </Button>
          }
        />

        {items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Browse laptops, desktops and components — every unit ships with serial-level warranty tracking."
              action={
                <Button asChild>
                  <Link to="/products">Browse catalog</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div className="surface-panel divide-y divide-border">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex flex-wrap items-center gap-4 p-5">
                  <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground">
                    {product.brand.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/products/$productId"
                      params={{ productId: product.id }}
                      className="truncate text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      SKU {product.sku} · {product.specs.warranty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={`Decrease quantity of ${product.name}`}
                      onClick={() => setQty(product.id, -1)}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium tabular-nums">{qty}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={`Increase quantity of ${product.name}`}
                      onClick={() => setQty(product.id, 1)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <p className="w-24 text-right text-sm font-semibold tabular-nums text-foreground">
                    {currencyPrecise(product.price * qty)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => setQty(product.id, -qty)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <aside className="surface-panel space-y-4 p-6 lg:sticky lg:top-24">
              <h2 className="text-sm font-semibold text-foreground">Order summary</h2>
              <dl className="space-y-2.5 text-sm">
                {[
                  ["Subtotal", currencyPrecise(subtotal)],
                  ["Shipping", shipping === 0 ? "Free" : currencyPrecise(shipping)],
                  ["VAT (10%)", currencyPrecise(tax)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium tabular-nums text-foreground">{v}</dd>
                  </div>
                ))}
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <dt>Coupon TWIN10</dt>
                    <dd className="font-medium tabular-nums">−{currencyPrecise(discount)}</dd>
                  </div>
                )}
              </dl>
              <Separator />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-semibold tabular-nums text-foreground">
                  {currencyPrecise(total)}
                </span>
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (coupon.trim().toUpperCase() === "TWIN10") {
                    setDiscount(subtotal * 0.1);
                    toast.success("Coupon TWIN10 applied — 10% off");
                  } else {
                    toast.error("That coupon code isn't valid");
                  }
                }}
              >
                <Input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                />
                <Button type="submit" variant="outline">
                  Apply
                </Button>
              </form>
              <Button size="lg" className="w-full" asChild>
                <Link to="/checkout">
                  Checkout <ArrowRight />
                </Link>
              </Button>
              <p className="space-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-success" /> 3-year warranty on TwinTech builds
                </span>
                <span className="flex items-center gap-2">
                  <Truck className="size-3.5 text-success" /> Free delivery on orders over $1,500
                </span>
              </p>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
