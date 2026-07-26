import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const nav = [
  { label: "Products", to: "/products" },
  { label: "Repair services", to: "/repairs" },
  { label: "Pricing", to: "/pricing" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-border/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-6">
        <Brand />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="relative hidden xl:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products, SKU, repairs…"
              aria-label="Search TwinTech"
              className="h-10 w-64 bg-card/70 pl-9"
            />
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Wishlist" asChild>
            <Link to="/wishlist">
              <Heart />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Shopping cart" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 justify-center px-1 text-[10px]">
                3
              </Badge>
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="hidden h-10 sm:inline-flex" asChild>
            <Link to="/login">
              <UserRound /> Sign in
            </Link>
          </Button>
          <Button size="sm" className="hidden h-10 sm:inline-flex" asChild>
            <Link to="/register">Get started</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm p-0">
              <div className="flex h-16 items-center border-b border-border px-5">
                <SheetTitle asChild>
                  <span>
                    <Brand />
                  </span>
                </SheetTitle>
              </div>
              <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {item.label}
                    <ChevronDown className="size-4 -rotate-90 text-muted-foreground" />
                  </Link>
                ))}
                <div className="mt-4 grid gap-2">
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/register">Create account</Link>
                  </Button>
                  <Button variant="ghost" asChild onClick={() => setOpen(false)}>
                    <Link to="/admin">Admin dashboard</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
