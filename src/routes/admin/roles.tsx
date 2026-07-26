import { createFileRoute } from "@tanstack/react-router";
import { Check, Minus, ShieldCheck, UserCog, Users } from "lucide-react";
import { AdminPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRole } from "@/components/providers/role-provider";
import { permissionLabels, permissionOrder, roleMeta, roleOrder } from "@/lib/roles";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/roles")({
  head: seo(
    "Roles & access — TwinTech Admin",
    "Role-based access control matrix for owners, managers, technicians, cashiers and customers.",
  ),
  component: AdminRoles,
});

function AdminRoles() {
  const { role, setRole } = useRole();

  return (
    <AdminPage
      title="Roles & access"
      crumb="Roles"
      description="Least-privilege defaults. Switching role instantly changes navigation and page access in this demo."
      actions={<Button onClick={() => toast.success("Role template saved")}>Save changes</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Roles defined" value={String(roleOrder.length)} hint="Least-privilege defaults" icon={UserCog} />
        <StatCard label="Permission scopes" value={String(permissionOrder.length)} hint="Module-level" icon={ShieldCheck} tone="success" />
        <StatCard label="Active role" value={roleMeta[role].label} hint="Applies to this session" icon={Users} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {roleOrder.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRole(r);
              toast.success(`Now browsing as ${roleMeta[r].label}`);
            }}
            className={`surface-panel p-4 text-left transition-colors hover:border-primary/50 ${
              r === role ? "border-primary ring-1 ring-primary/30" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-foreground">{roleMeta[r].label}</span>
              {r === role && <Badge variant="soft">Active</Badge>}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {roleMeta[r].description}
            </p>
            <p className="mt-3 text-[11px] font-medium tracking-wide text-primary uppercase">
              {roleMeta[r].permissions.length} scopes
            </p>
          </button>
        ))}
      </div>

      <div className="surface-panel overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Permission scope
              </th>
              {roleOrder.map((r) => (
                <th
                  key={r}
                  className="px-4 py-3 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {roleMeta[r].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionOrder.map((permission) => (
              <tr key={permission} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-4 py-3.5 font-medium text-foreground">
                  {permissionLabels[permission]}
                </td>
                {roleOrder.map((r) => {
                  const granted = roleMeta[r].permissions.includes(permission);
                  return (
                    <td key={r} className="px-4 py-3.5 text-center">
                      {granted ? (
                        <Check className="mx-auto size-4 text-success" aria-label="Granted" />
                      ) : (
                        <Minus className="mx-auto size-4 text-muted-foreground" aria-label="Not granted" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}