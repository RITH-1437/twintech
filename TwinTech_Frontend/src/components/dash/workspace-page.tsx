import type { ReactNode } from "react";
import { DashShell } from "@/components/dash/dash-shell";
import { adminNav, customerNav } from "@/components/dash/nav-config";
import { PageHeader } from "@/components/shared/page-header";

export function AdminPage({
  title,
  description,
  crumb,
  actions,
  children,
}: {
  title: string;
  description?: string;
  crumb?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <DashShell
      groups={adminNav}
      workspace="Admin console"
      user={{ name: "Bora Tep", email: "bora@twintech.dev", initials: "BT" }}
      breadcrumb={["TwinTech", "Admin", crumb ?? title]}
    >
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </DashShell>
  );
}

export function CustomerPage({
  title,
  description,
  crumb,
  actions,
  children,
}: {
  title: string;
  description?: string;
  crumb?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <DashShell
      groups={customerNav}
      workspace="Customer portal"
      user={{ name: "Sokha Chan", email: "sokha@twintech.dev", initials: "SC" }}
      breadcrumb={["TwinTech", "Dashboard", crumb ?? title]}
    >
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </DashShell>
  );
}