import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { DashShell } from "@/components/dash/dash-shell";
import { customerNav } from "@/components/dash/nav-config";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/$")({
  head: seo(
    "Page in progress — TwinTech Dashboard",
    "This TwinTech customer dashboard page is not available yet. Return to your overview.",
  ),
  component: DashboardFallback,
});

function labelFor(path: string) {
  const match = customerNav.flatMap((g) => g.items).find((i) => i.to === `/dashboard/${path}`);
  if (match) return match.label;
  const last = path.split("/").filter(Boolean).pop() ?? "Page";
  return last.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function DashboardFallback() {
  const { _splat } = Route.useParams();
  const title = labelFor(_splat ?? "");

  return (
    <DashShell
      groups={customerNav}
      workspace="Customer portal"
      user={{ name: "Sokha Lim", email: "sokha@twintech.dev", initials: "SL" }}
      breadcrumb={["TwinTech", "Dashboard", title]}
    >
      <PageHeader title={title} description="This page is being built for your account." />
      <EmptyState
        icon={Construction}
        title={`${title} isn't available yet`}
        description="We couldn't find this page. It's either still in development or the link has changed."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link to="/dashboard">Back to overview</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact support</Link>
            </Button>
          </div>
        }
      />
    </DashShell>
  );
}