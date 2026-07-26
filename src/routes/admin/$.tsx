import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { DashShell } from "@/components/dash/dash-shell";
import { adminNav } from "@/components/dash/nav-config";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/$")({
  head: seo(
    "Module in progress — TwinTech Admin",
    "This TwinTech admin module is not available yet. Return to the operations dashboard.",
  ),
  component: AdminFallback,
});

function labelFor(path: string) {
  const match = adminNav.flatMap((g) => g.items).find((i) => i.to === `/admin/${path}`);
  if (match) return match.label;
  const last = path.split("/").filter(Boolean).pop() ?? "Module";
  return last.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function AdminFallback() {
  const { _splat } = Route.useParams();
  const title = labelFor(_splat ?? "");

  return (
    <DashShell
      groups={adminNav}
      workspace="Admin console"
      user={{ name: "Bora Tep", email: "bora@twintech.dev", initials: "BT" }}
      breadcrumb={["TwinTech", "Admin", title]}
    >
      <PageHeader title={title} description="This module is being built for your workspace." />
      <EmptyState
        icon={Construction}
        title={`${title} isn't available yet`}
        description="We couldn't find this admin page. It's either still in development or the link has changed."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link to="/admin">Back to dashboard</Link>
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