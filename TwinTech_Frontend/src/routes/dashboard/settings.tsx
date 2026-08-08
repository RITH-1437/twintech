import { createFileRoute } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/dash-shell";
import { customerNav } from "@/components/dash/nav-config";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: seo(
    "Account settings — TwinTech",
    "Update your TwinTech profile, delivery address, notification channels and security preferences.",
  ),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <DashShell
      groups={customerNav}
      workspace="Customer portal"
      user={{ name: "Sokha Chan", email: "sokha@twintech.dev", initials: "SC" }}
      breadcrumb={["TwinTech", "Dashboard", "Settings"]}
    >
      <PageHeader title="Settings" description="Profile, notifications and security." />
      <form
        className="grid gap-5 lg:grid-cols-2 lg:items-start"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Settings saved");
        }}
      >
        <fieldset className="surface-panel grid gap-4 p-6 sm:grid-cols-2">
          <legend className="mb-2 text-sm font-semibold text-foreground">Profile</legend>
          <div className="grid gap-2">
            <Label htmlFor="sfirst">First name</Label>
            <Input id="sfirst" defaultValue="Sokha" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slast">Last name</Label>
            <Input id="slast" defaultValue="Chan" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="semail">Email</Label>
            <Input id="semail" type="email" defaultValue="sokha@twintech.dev" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="saddr">Default delivery address</Label>
            <Input id="saddr" defaultValue="#128 Norodom Blvd, Phnom Penh" />
          </div>
          <Button type="submit" className="sm:col-span-2">
            Save changes
          </Button>
        </fieldset>
        <div className="surface-panel p-6">
          <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
          <div className="mt-4 space-y-4">
            {[
              ["Repair status updates", "Every state change on your jobs", true],
              ["Order and delivery alerts", "Payment receipts and dispatch notices", true],
              ["Price drop alerts", "Wishlist items that get cheaper", false],
              ["Product newsletter", "Monthly hardware roundup", false],
            ].map(([title, hint, on]) => (
              <label key={title as string} className="flex items-start justify-between gap-4">
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{title}</span>
                  <span className="block text-xs text-muted-foreground">{hint}</span>
                </span>
                <Switch defaultChecked={on as boolean} />
              </label>
            ))}
          </div>
          <Separator className="my-6" />
          <h2 className="text-sm font-semibold text-foreground">Security</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Two-factor authentication via Telegram or SMS.
          </p>
          <Button variant="outline" className="mt-4" type="button">
            Enable two-factor auth
          </Button>
        </div>
      </form>
    </DashShell>
  );
}
