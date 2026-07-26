import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutGrid, List, Search, SlidersHorizontal, Star } from "lucide-react";
import productLaptop from "@/assets/product-laptop.jpg";
import productDesktop from "@/assets/product-desktop.jpg";
import { SiteLayout } from "@/components/site/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { categories, currency, products } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
  head: seo(
    "Products — Laptops, Desktops & Components | TwinTech",
    "Browse TwinTech laptops, desktops, monitors and components with live stock, serial-backed warranty and ABA PayWay checkout.",
  ),
  component: ProductsPage,
});

const imageFor = (category: string) => (category === "Desktops" ? productDesktop : productLaptop);

function ProductsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2600);
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
        (selected.length === 0 || selected.includes(p.category)) &&
        p.price <= maxPrice,
    );
    if (sort === "price-asc") return [...rows].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...rows].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...rows].sort((a, b) => b.rating - a.rating);
    return rows;
  }, [query, selected, maxPrice, sort]);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Products</span>
          </nav>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Shop hardware
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {products.length} in-stock lines across {categories.length} categories. Every unit ships
            with a serial-tracked warranty record.
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="surface-panel h-fit p-5 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="size-4 text-primary" /> Filters
          </h2>
          <div className="mt-5">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Category
            </h3>
            <div className="mt-3 space-y-2.5">
              {categories.map((c) => (
                <label key={c.name} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={selected.includes(c.name)}
                    onCheckedChange={(v) =>
                      setSelected((prev) =>
                        v ? [...prev, c.name] : prev.filter((p) => p !== c.name),
                      )
                    }
                  />
                  <span className="flex-1 text-foreground">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.count}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Max price
            </h3>
            <Slider
              className="mt-4"
              value={[maxPrice]}
              min={100}
              max={2600}
              step={50}
              onValueChange={([v]) => setMaxPrice(v)}
              aria-label="Maximum price"
            />
            <p className="mt-2 text-sm font-medium text-foreground">up to {currency(maxPrice)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-6 w-full"
            onClick={() => {
              setSelected([]);
              setMaxPrice(2600);
              setQuery("");
            }}
          >
            Reset filters
          </Button>
        </aside>

        <div>
          <div className="surface-panel mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product or SKU…"
                aria-label="Search products"
                className="h-10 pl-9"
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-full sm:w-[180px]" aria-label="Sort products">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                aria-label="Grid view"
                onClick={() => setView("grid")}
              >
                <LayoutGrid />
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="icon"
                aria-label="List view"
                onClick={() => setView("list")}
              >
                <List />
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products match those filters"
              description="Try widening the price range or clearing a category to see more hardware."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelected([]);
                    setMaxPrice(2600);
                    setQuery("");
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div
              className={cn(
                "grid gap-5",
                view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
              )}
            >
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  to="/products/$productId"
                  params={{ productId: p.id }}
                  className={cn(
                    "surface-panel hover-lift group overflow-hidden",
                    view === "list" && "flex gap-5",
                  )}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden bg-muted",
                      view === "list" ? "w-44 shrink-0" : "aspect-[4/3]",
                    )}
                  >
                    <img
                      src={imageFor(p.category)}
                      alt={p.name}
                      loading="lazy"
                      width={1200}
                      height={900}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {p.badge && (
                      <Badge
                        variant={p.stock === 0 ? "destructive" : p.stock < 6 ? "warning" : "default"}
                        className="absolute top-3 left-3"
                      >
                        {p.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p>
                    <h3 className="mt-1 text-sm font-semibold text-foreground">{p.name}</h3>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3.5 fill-warning text-warning" /> {p.rating} ({p.reviews})
                      <span className="mx-1">·</span>
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </p>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                      <span className="text-lg font-semibold text-foreground">{currency(p.price)}</span>
                      {p.compareAt && (
                        <span className="text-sm text-muted-foreground line-through">
                          {currency(p.compareAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
