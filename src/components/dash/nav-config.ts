import {
  Activity,
  BadgePercent,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  Gauge,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Package,
  PackageSearch,
  Receipt,
  ScanLine,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  UserRound,
  Users,
  UserCog,
  Wrench,
} from "lucide-react";
import type { NavGroup } from "@/components/dash/dash-sidebar";

export const customerNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "My orders", to: "/dashboard/orders", icon: ShoppingBag, badge: "4" },
      { label: "Wishlist", to: "/dashboard/wishlist", icon: Heart },
    ],
  },
  {
    title: "Service",
    items: [
      { label: "Repair requests", to: "/dashboard/repairs", icon: Wrench, badge: "2" },
      { label: "Warranty", to: "/dashboard/warranty", icon: ShieldCheck },
      { label: "Support tickets", to: "/dashboard/support", icon: MessageSquare },
    ],
  },
  {
    title: "Billing",
    items: [
      { label: "Invoices", to: "/dashboard/invoices", icon: FileText },
      { label: "Payment history", to: "/dashboard/payments", icon: CreditCard },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Notifications", to: "/dashboard/notifications", icon: Bell },
      { label: "Settings", to: "/dashboard/settings", icon: Settings },
    ],
  },
];

export const adminNav: NavGroup[] = [
  {
    title: "Insights",
    items: [
      { label: "Dashboard", to: "/admin", icon: Gauge, permission: "insights" },
      { label: "Analytics", to: "/admin/analytics", icon: BarChart3, permission: "insights" },
      { label: "Reports", to: "/admin/reports", icon: FileText, permission: "insights" },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Orders", to: "/admin/orders", icon: ShoppingBag, badge: "12", permission: "commerce" },
      { label: "Payments", to: "/admin/payments", icon: CreditCard, permission: "payments" },
      { label: "ABA PayWay", to: "/admin/payway", icon: ScanLine, badge: "2", permission: "payments" },
      { label: "Products", to: "/admin/products", icon: Package, permission: "commerce" },
      { label: "Coupons", to: "/admin/coupons", icon: BadgePercent, permission: "commerce" },
      { label: "Reviews", to: "/admin/reviews", icon: Star, permission: "commerce" },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Stock & warehouse", to: "/admin/inventory", icon: Boxes, permission: "inventory" },
      { label: "Low stock", to: "/admin/inventory/low-stock", icon: PackageSearch, badge: "3", permission: "inventory" },
      { label: "Suppliers", to: "/admin/suppliers", icon: Building2, permission: "inventory" },
      { label: "Purchase orders", to: "/admin/purchase-orders", icon: Truck, permission: "inventory" },
    ],
  },
  {
    title: "Service desk",
    items: [
      { label: "Repair jobs", to: "/admin/repairs", icon: Wrench, badge: "6", permission: "service" },
      { label: "Technicians", to: "/admin/technicians", icon: Users, permission: "service" },
      { label: "Appointments", to: "/admin/appointments", icon: CalendarDays, permission: "service" },
      { label: "Warranty claims", to: "/admin/warranty", icon: ShieldCheck, permission: "service" },
    ],
  },
  {
    title: "People & system",
    items: [
      { label: "Customers", to: "/admin/customers", icon: UserRound, permission: "people" },
      { label: "Employees", to: "/admin/employees", icon: ClipboardList, permission: "people" },
      { label: "Roles & access", to: "/admin/roles", icon: UserCog, permission: "people" },
      { label: "Audit logs", to: "/admin/audit-logs", icon: Activity, permission: "people" },
      { label: "Invoicing", to: "/admin/invoices", icon: Receipt, permission: "payments" },
      { label: "Settings", to: "/admin/settings", icon: Settings, permission: "settings" },
    ],
  },
];
