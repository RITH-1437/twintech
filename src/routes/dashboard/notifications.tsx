import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Bell, CheckCircle2, Info, XCircle } from "lucide-react";
import { CustomerPage } from "@/components/dash/workspace-page";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { notifications } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/notifications")({
  head: seo(
    "Notifications — TwinTech dashboard",
    "Repair updates, payment confirmations and stock alerts, with per-channel delivery preferences.",
  ),
  component: CustomerNotifications,
});

const iconFor = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
} as const;

const toneFor = {
  info: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-destructive-soft text-destructive",
} as const;

const prefs = [
  { id: "repair", label: "Repair status changes", desc: "Every stage from diagnostics to handover.", on: true },
  { id: "payment", label: "Payment & settlement", desc: "Receipts, refunds and failed charges.", on: true },
  { id: "stock", label: "Back-in-stock alerts", desc: "Saved items returning to inventory.", on: false },
  { id: "news", label: "Product news", desc: "Monthly digest, no more than one email.", on: false },
];

function CustomerNotifications() {
  return (
    <CustomerPage
      title="Notifications"
      description="Live activity across your orders, repairs and payments."
      actions={<Button variant="outline">Mark all as read</Button>}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="surface-panel divide-y divide-border p-0">
          {notifications.map((n) => {
            const Icon = iconFor[n.type];
            return (
              <div key={n.title} className="flex items-start gap-3 p-4">
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${toneFor[n.type]}`}>
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                </div>
                <Bell className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
              </div>
            );
          })}
        </div>
        <div className="surface-panel p-5">
          <h2 className="text-sm font-semibold text-foreground">Delivery preferences</h2>
          <p className="mt-1 text-xs text-muted-foreground">Applies to email, SMS and in-app.</p>
          <div className="mt-5 space-y-5">
            {prefs.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Label htmlFor={p.id} className="text-sm font-medium">{p.label}</Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <Switch id={p.id} defaultChecked={p.on} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomerPage>
  );
}