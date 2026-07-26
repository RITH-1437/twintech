import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { LifeBuoy, LogOut } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { useRole } from "@/components/providers/role-provider";
import type { Permission } from "@/lib/roles";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  permission?: Permission;
};
export type NavGroup = { title: string; items: NavItem[] };

export function DashSidebar({ groups, footerLabel }: { groups: NavGroup[]; footerLabel: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { can } = useRole();
  const visibleGroups = groups
    .map((group) => ({ ...group, items: group.items.filter((item) => can(item.permission)) }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-4">
        <Brand />
      </SidebarHeader>
      <SidebarContent className="gap-1 px-1 py-3">
        {visibleGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-[0.68rem] tracking-[0.14em] uppercase">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={item.label}>
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help & support">
              <Link to="/contact">
                <LifeBuoy />
                <span>{footerLabel}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign out">
              <Link to="/login">
                <LogOut />
                <span>Sign out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
