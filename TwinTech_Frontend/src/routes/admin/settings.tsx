import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/dash/workspace-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/settings")({
  head: seo(
    "Workspace settings — TwinTech Admin",
    "Configure company details, branches, payment channels, tax rules and security policy for TwinTech.",
  ),
  component: AdminSettings,
});

const toggles = [
  { id: "aba", label: "ABA PayWay", desc: "Card, ABA Pay and deep links.", on: true },
  { id: "khqr", label: "KHQR", desc: "Scan-to-pay across Bakong banks.", on: true },
  { id: "cash", label: "Cash at counter", desc: "Recorded against branch till.", on: true },
  { id: "terms", label: "Net-30 terms", desc: "Enterprise accounts only.", on: false },
];

const security = [
  { id: "2fa", label: "Enforce 2FA", desc: "Required for all staff accounts.", on: true },
  { id: "ip", label: "IP allowlist", desc: "Restrict admin console to office ranges.", on: false },
  { id: "audit", label: "Signed audit exports", desc: "Attach signature to every export.", on: true },
];

function AdminSettings() {
  return (
    <AdminPage title="Workspace settings" crumb="Settings" description="Applies to all four TwinTech branches." actions={<Button>Save changes</Button>}>
      <Tabs defaultValue="company" className="w-full">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-5">
          <div className="surface-panel grid gap-5 p-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Legal name</Label>
              <Input id="company" defaultValue="TwinTech Computer Co., Ltd" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vat">VAT / TIN</Label>
              <Input id="vat" defaultValue="K001-901234567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Billing email</Label>
              <Input id="email" type="email" defaultValue="billing@twintech.dev" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Support line</Label>
              <Input id="phone" defaultValue="+855 23 900 120" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Head office</Label>
              <Input id="address" defaultValue="No. 128, Street 271, Toul Kork, Phnom Penh" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-5">
          <div className="surface-panel divide-y divide-border p-0">
            {toggles.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-4 p-5">
                <div className="min-w-0">
                  <Label htmlFor={t.id} className="text-sm font-medium">{t.label}</Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <Switch id={t.id} defaultChecked={t.on} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-5">
          <div className="surface-panel p-5">
            <div className="divide-y divide-border">
              {security.map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                  <div className="min-w-0">
                    <Label htmlFor={s.id} className="text-sm font-medium">{s.label}</Label>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <Switch id={s.id} defaultChecked={s.on} />
                </div>
              ))}
            </div>
            <Separator className="my-5" />
            <p className="text-xs text-muted-foreground">Session timeout is 30 minutes of inactivity for admin roles.</p>
          </div>
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}