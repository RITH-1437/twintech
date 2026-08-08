import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Lock, QrCode } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { currencyPrecise, products } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: seo(
    "Secure checkout — TwinTech",
    "Complete your TwinTech order with ABA PayWay, KHQR scan-to-pay or card. Encrypted and reconciled instantly.",
  ),
  component: CheckoutPage,
});

function CheckoutPage() {
  const lines = products.slice(0, 2).map((p) => ({ product: p, qty: 1 }));
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const [method, setMethod] = useState("payway");

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <PageHeader title="Checkout" description="Step 2 of 2 · Delivery and payment" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Payment authorised — order TT-10429 confirmed");
            }}
          >
            <fieldset className="surface-panel grid gap-4 p-6 sm:grid-cols-2">
              <legend className="mb-2 text-sm font-semibold text-foreground">Delivery details</legend>
              <div className="grid gap-2">
                <Label htmlFor="coname">Full name</Label>
                <Input id="coname" required defaultValue="Sokha Chan" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cophone">Phone</Label>
                <Input id="cophone" required defaultValue="+855 12 345 678" />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="coaddr">Delivery address</Label>
                <Input id="coaddr" required defaultValue="#128 Norodom Blvd, Phnom Penh" />
              </div>
            </fieldset>

            <fieldset className="surface-panel p-6">
              <legend className="mb-4 text-sm font-semibold text-foreground">Payment method</legend>
              <RadioGroup value={method} onValueChange={setMethod} className="gap-3">
                {[
                  { id: "payway", label: "ABA PayWay", hint: "Redirect to ABA Mobile or bank login", icon: CreditCard },
                  { id: "khqr", label: "KHQR scan-to-pay", hint: "Scan with any Bakong-enabled app", icon: QrCode },
                  { id: "card", label: "Credit or debit card", hint: "Visa, Mastercard, UnionPay", icon: CreditCard },
                ].map((m) => (
                  <Label
                    key={m.id}
                    htmlFor={m.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 has-[:checked]:border-primary has-[:checked]:bg-primary-soft/50"
                  >
                    <RadioGroupItem id={m.id} value={m.id} />
                    <m.icon className="size-4 text-primary" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{m.label}</span>
                      <span className="block text-xs text-muted-foreground">{m.hint}</span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </fieldset>

            <Button type="submit" size="lg" className="w-full">
              <Lock /> Pay {currencyPrecise(total)}
            </Button>
          </form>

          <aside className="surface-panel space-y-4 p-6 lg:sticky lg:top-24">
            <h2 className="text-sm font-semibold text-foreground">Order summary</h2>
            <ul className="space-y-3">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 text-muted-foreground">
                    {product.name} × {qty}
                  </span>
                  <span className="font-medium tabular-nums text-foreground">
                    {currencyPrecise(product.price * qty)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT (10%)</span>
              <span className="tabular-nums text-foreground">{currencyPrecise(tax)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-semibold tabular-nums text-foreground">
                {currencyPrecise(total)}
              </span>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/cart">Back to cart</Link>
            </Button>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
