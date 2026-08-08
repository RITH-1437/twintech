import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronRight, Check, Search, ShieldCheck } from "lucide-react";
import { DashSidebar, type NavGroup } from "@/components/dash/dash-sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  GlobalSearch,
  GlobalSearchTrigger,
  useGlobalSearch,
} from "@/components/shared/global-search";
import { AccessDenied } from "@/components/shared/error-state";
import { useRole } from "@/components/providers/role-provider";
import { permissionForPath, roleMeta, roleOrder } from "@/lib/roles";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { notifications } from "@/lib/mock-data";
import { toast } from "sonner";

export function DashShell({
  groups,
  workspace,
  user,
  breadcrumb,
  children,
}: {
  groups: NavGroup[];
  workspace: string;
  user: { name: string; email: string; initials: string };
  breadcrumb: string[];
  children: ReactNode;
}) {
  const { open, setOpen } = useGlobalSearch();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role, setRole, can, label } = useRole();
  const permission = permissionForPath(pathname);
  const allowed = can(permission);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <GlobalSearch open={open} onOpenChange={setOpen} />
        <DashSidebar groups={groups} footerLabel="Help & support" />
        <SidebarInset className="min-w-0 flex-1">
          <header className="glass sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border px-4 sm:px-6">
            <SidebarTrigger className="shrink-0" />
            <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm md:flex">
              {breadcrumb.map((crumb, i) => (
                <span key={crumb} className="flex min-w-0 items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />}
                  <span
                    className={
                      i === breadcrumb.length - 1
                        ? "truncate font-medium text-foreground"
                        : "truncate text-muted-foreground"
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1.5">
              <GlobalSearchTrigger onOpen={() => setOpen(true)} />
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open global search"
                onClick={() => setOpen(true)}
              >
                <Search />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden h-10 gap-1.5 sm:flex">
                    <ShieldCheck className="text-primary" />
                    <span className="text-xs font-medium">{label}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Active role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {roleOrder.map((r) => (
                    <DropdownMenuItem
                      key={r}
                      className="flex-col items-start gap-0.5 py-2.5"
                      onSelect={() => {
                        setRole(r);
                        toast.success(`Now browsing as ${roleMeta[r].label}`);
                      }}
                    >
                      <span className="flex w-full items-center gap-2 text-sm font-medium">
                        {roleMeta[r].label}
                        {r === role && <Check className="ml-auto size-3.5 text-primary" />}
                      </span>
                      <span className="text-xs text-muted-foreground">{roleMeta[r].description}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                    <Bell />
                    <span className="absolute top-2 right-2.5 size-2 rounded-full bg-destructive ring-2 ring-card" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications <Badge variant="soft">{notifications.length} new</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((n) => (
                    <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5 py-2.5">
                      <span className="text-sm leading-snug font-medium">{n.title}</span>
                      <span className="text-xs text-muted-foreground">{n.time}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-accent"
                    aria-label="Account menu"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary-soft text-xs font-semibold text-primary">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-left sm:block">
                      <span className="block text-xs leading-tight font-medium text-foreground">
                        {user.name}
                      </span>
                      <span className="block text-[11px] leading-tight text-muted-foreground">
                        {workspace}
                      </span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <span className="block text-sm font-medium">{user.name}</span>
                    <span className="block text-xs text-muted-foreground">{user.email}</span>
                    <Badge variant="soft" className="mt-2">
                      {label}
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings">Profile & settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin console</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Customer dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            {allowed ? (
              children
            ) : (
              <AccessDenied roleLabel={label} module={breadcrumb[breadcrumb.length - 1].toLowerCase()} />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
