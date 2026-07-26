import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Brand />
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 TwinTech Co., Ltd. ·{" "}
          <Link to="/" className="hover:text-foreground">
            Back to site
          </Link>
        </p>
      </div>
      <aside className="gradient-hero relative hidden flex-col justify-center overflow-hidden border-l border-border px-12 lg:flex">
        <div className="grid-lines absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            One workspace for the counter, the workshop and the warehouse
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "Serial-level inventory with barcode and QR intake",
              "Repair jobs with customer-visible timelines",
              "ABA PayWay and KHQR payments, reconciled daily",
              "Role-based permissions with signed audit logs",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
                  <Check className="size-3" />
                </span>
                {line}
              </li>
            ))}
          </ul>
          <div className="surface-panel mt-10 p-5">
            <p className="text-sm leading-relaxed text-foreground">
              “Repair intake, technician notes and settlement in one place. My counter staff learned it
              in an afternoon.”
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Dara Kim · Owner, KimTech Store</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
