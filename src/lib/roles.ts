export type Permission =
  | "insights"
  | "commerce"
  | "payments"
  | "inventory"
  | "service"
  | "people"
  | "settings"
  | "portal";

export type Role = "owner" | "manager" | "technician" | "cashier" | "customer";

export const permissionLabels: Record<Permission, string> = {
  insights: "Insights & analytics",
  commerce: "Orders, products & promos",
  payments: "Payments & invoicing",
  inventory: "Inventory & procurement",
  service: "Repair & service desk",
  people: "People, roles & audit",
  settings: "Workspace settings",
  portal: "Customer portal",
};

export const permissionOrder: Permission[] = [
  "insights",
  "commerce",
  "payments",
  "inventory",
  "service",
  "people",
  "settings",
  "portal",
];

export const roleMeta: Record<
  Role,
  { label: string; description: string; permissions: Permission[] }
> = {
  owner: {
    label: "Owner",
    description: "Unrestricted access across every branch and module.",
    permissions: [...permissionOrder],
  },
  manager: {
    label: "Store manager",
    description: "Runs commerce, inventory and service. No role or audit administration.",
    permissions: ["insights", "commerce", "payments", "inventory", "service", "portal"],
  },
  technician: {
    label: "Technician",
    description: "Service desk only — repair jobs, appointments and warranty claims.",
    permissions: ["service", "portal"],
  },
  cashier: {
    label: "Cashier",
    description: "Front-of-house sales: orders, payments and PayWay reconciliation.",
    permissions: ["commerce", "payments", "portal"],
  },
  customer: {
    label: "Customer",
    description: "Portal access only: orders, repairs, warranty and receipts.",
    permissions: ["portal"],
  },
};

export const roleOrder: Role[] = ["owner", "manager", "technician", "cashier", "customer"];

/** Longest-prefix match wins. */
const routePermissions: [string, Permission][] = [
  ["/admin/analytics", "insights"],
  ["/admin/reports", "insights"],
  ["/admin/orders", "commerce"],
  ["/admin/products", "commerce"],
  ["/admin/coupons", "commerce"],
  ["/admin/reviews", "commerce"],
  ["/admin/payments", "payments"],
  ["/admin/payway", "payments"],
  ["/admin/invoices", "payments"],
  ["/admin/inventory", "inventory"],
  ["/admin/suppliers", "inventory"],
  ["/admin/purchase-orders", "inventory"],
  ["/admin/repairs", "service"],
  ["/admin/technicians", "service"],
  ["/admin/appointments", "service"],
  ["/admin/warranty", "service"],
  ["/admin/customers", "people"],
  ["/admin/employees", "people"],
  ["/admin/roles", "people"],
  ["/admin/audit-logs", "people"],
  ["/admin/settings", "settings"],
  ["/admin", "insights"],
  ["/dashboard", "portal"],
];

export function permissionForPath(pathname: string): Permission | null {
  const match = routePermissions
    .filter(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return match ? match[1] : null;
}

export function can(role: Role, permission?: Permission | null) {
  if (!permission) return true;
  return roleMeta[role].permissions.includes(permission);
}