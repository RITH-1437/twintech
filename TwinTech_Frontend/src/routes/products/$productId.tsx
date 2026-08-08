import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Check,
  Cpu,
  Heart,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import productLaptop from "@/assets/product-laptop.jpg";
import productDesktop from "@/assets/product-desktop.jpg";
import repairBench from "@/assets/repair-bench.jpg";
import { SiteLayout } from "@/components/site/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currency, products, reviews } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name ?? "Product"} — TwinTech` },
      {
        name: "description",
        content: loaderData?.product.blurb ?? "TwinTech hardware with serial-tracked warranty.",
      },
      { property: "og:title", content: `${loaderData?.product.name ?? "Product"} — TwinTech` },
      { property: "og:description", content: loaderData?.product.blurb ?? "" },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const gallery = [
    product.category === "Desktops" ? productDesktop : productLaptop,
    repairBench,
    product.category === "Desktops" ? productLaptop : productDesktop,
  ];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  const specRows = [
    { label: "Processor", value: product.specs.cpu },
    { label: "Graphics", value: product.specs.gpu },
    { label: "Memory", value: product.specs.ram },
    { label: "Storage", value: product.specs.storage },
    { label: "Motherboard", value: product.specs.motherboard },
    { label: "Warranty", value: product.specs.warranty },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-foreground">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="surface-panel aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={gallery[active]}
                alt={`${product.name} view ${active + 1}`}
                width={1200}
                height={900}
                className="size-full object-cover"
              />
            </div>
            <div className="mt-3 flex gap-3">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === active}
                  className={cn(
                    "size-20 overflow-hidden rounded-lg border-2 transition-colors",
                    i === active ? "border-primary" : "border-border hover:border-primary/40",
                  )}
                >
                  <img src={src} alt="" loading="lazy" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="soft">{product.category}</Badge>
              {product.stock > 6 ? (
                <Badge variant="success">In stock · {product.stock} units</Badge>
              ) : product.stock > 0 ? (
                <Badge variant="warning">Low stock · {product.stock} left</Badge>
              ) : (
                <Badge variant="destructive">Out of stock</Badge>
              )}
              <span className="text-xs text-muted-foreground">SKU {product.sku}</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="flex text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("size-4", i < Math.round(product.rating) ? "fill-current" : "opacity-30")}
                  />
                ))}
              </span>
              <span className="text-muted-foreground">
                {product.rating} · {product.reviews} reviews
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.blurb}</p>

            <div className="mt-7 flex items-end gap-3">
              <span className="text-4xl font-semibold tracking-tight text-foreground">
                {currency(product.price)}
              </span>
              {product.compareAt && (
                <span className="pb-1.5 text-lg text-muted-foreground line-through">
                  {currency(product.compareAt)}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-11 items-center rounded-lg border border-border bg-card">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus />
                </Button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus />
                </Button>
              </div>
              <Button
                size="lg"
                disabled={product.stock === 0}
                onClick={() => toast.success(`${qty} × ${product.name} added to cart`)}
              >
                <ShoppingCart /> Add to cart
              </Button>
              <Button variant="hero" size="lg" disabled={product.stock === 0} asChild>
                <Link to="/checkout">Buy now</Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Add to wishlist"
                className="h-12 w-12"
                onClick={() => toast("Saved to wishlist")}
              >
                <Heart />
              </Button>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, label: "Free delivery in Phnom Penh" },
                { icon: ShieldCheck, label: product.specs.warranty },
                { icon: Package, label: "14-day return window" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2 rounded-lg bg-muted/60 p-3">
                  <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-xs leading-snug text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="specs" className="mt-14">
          <TabsList>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            <TabsTrigger value="warranty">Warranty & service</TabsTrigger>
          </TabsList>
          <TabsContent value="specs" className="mt-6">
            <div className="surface-panel overflow-hidden">
              <dl className="divide-y divide-border">
                {specRows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_1.6fr] gap-4 px-5 py-3.5">
                    <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Cpu className="size-3.5" /> {row.label}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="surface-panel p-5">
                <div className="flex text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("size-4", i < r.rating ? "fill-current" : "opacity-30")} />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">{r.name} · {r.role}</figcaption>
              </figure>
            ))}
          </TabsContent>
          <TabsContent value="warranty" className="mt-6">
            <div className="surface-panel p-6">
              <h3 className="text-sm font-semibold text-foreground">
                {product.specs.warranty} · serial-tracked
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Coverage registered against the unit serial at checkout — no receipt needed for claims.",
                  "Free diagnostics for the full warranty period at any TwinTech service counter.",
                  "Loan device available for business plans while repairs are in progress.",
                  "Warranty status and remaining days visible in your customer dashboard.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" /> {line}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-14" />

        <h2 className="text-xl font-semibold tracking-tight text-foreground">Related products</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.id}
              to="/products/$productId"
              params={{ productId: p.id }}
              className="surface-panel hover-lift group overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={p.category === "Desktops" ? productDesktop : productLaptop}
                  alt={p.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                <p className="mt-2 text-sm font-semibold text-primary">{currency(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
