import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const groups = [
  {
    title: "Platform",
    links: [
      { label: "Products", to: "/products" },
      { label: "Repair services", to: "/repairs" },
      { label: "Pricing", to: "/pricing" },
      { label: "Store locator", to: "/stores" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Create account", to: "/register" },
      { label: "My dashboard", to: "/dashboard" },
      { label: "Admin console", to: "/admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Brand />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The retail operating system for computer stores — inventory, repairs, warranties and ABA
            PayWay payments in a single workspace.
          </p>
          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input type="email" required placeholder="Work email" aria-label="Email for updates" className="h-10" />
            <Button type="submit" className="h-10 shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
        {groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="text-xs font-semibold tracking-[0.14em] text-foreground uppercase">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TwinTech Co., Ltd. Phnom Penh, Cambodia.</p>
          <p className="flex flex-wrap items-center gap-4">
            <span>Payments secured by ABA PayWay · KHQR</span>
            <Link to="/" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/" className="hover:text-foreground">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
