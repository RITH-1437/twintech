import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command as CommandIcon, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { adminNav, customerNav } from "@/components/dash/nav-config";
import { useRole } from "@/components/providers/role-provider";
import {
  currency,
  customersList,
  inventory,
  orders,
  products,
  repairJobs,
  transactions,
} from "@/lib/mock-data";

type Entry = { group: string; label: string; hint: string; to: string };

export function useGlobalSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen };
}

export function GlobalSearchTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open global search"
      className="hidden h-10 w-72 items-center gap-2 rounded-lg border border-input bg-card/70 pr-2 pl-3 text-sm text-muted-foreground transition-colors hover:bg-accent lg:flex"
    >
      <Search className="size-4 shrink-0" />
      <span className="truncate">Search orders, repairs, SKUs…</span>
      <kbd className="ml-auto flex shrink-0 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
        <CommandIcon className="size-3" />K
      </kbd>
    </button>
  );
}

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const { can } = useRole();

  const entries = useMemo<Entry[]>(() => {
    const nav: Entry[] = [
      ...adminNav.flatMap((g) =>
        g.items
          .filter((i) => can(i.permission))
          .map((i) => ({ group: "Admin pages", label: i.label, hint: g.title, to: i.to })),
      ),
      ...customerNav.flatMap((g) =>
        g.items.map((i) => ({ group: "Portal pages", label: i.label, hint: g.title, to: i.to })),
      ),
    ];

    const records: Entry[] = [];
    if (can("commerce")) {
      records.push(
        ...products.map((p) => ({
          group: "Products",
          label: p.name,
          hint: `${p.category} · ${currency(p.price)}`,
          to: `/products/${p.id}`,
        })),
        ...orders.map((o) => ({
          group: "Orders",
          label: `${o.id} — ${o.customer}`,
          hint: `${o.status} · ${currency(o.total)} · ${o.method}`,
          to: "/admin/orders",
        })),
      );
    }
    if (can("payments")) {
      records.push(
        ...transactions.map((t) => ({
          group: "Payments",
          label: `${t.id} — ${t.order}`,
          hint: `${t.channel} · ${t.status}`,
          to: "/admin/payway",
        })),
      );
    }
    if (can("service")) {
      records.push(
        ...repairJobs.map((j) => ({
          group: "Repair jobs",
          label: `${j.id} — ${j.device}`,
          hint: `${j.customer} · ${j.status}`,
          to: "/admin/repairs",
        })),
      );
    }
    if (can("inventory")) {
      records.push(
        ...inventory.map((i) => ({
          group: "Inventory",
          label: `${i.sku} — ${i.name}`,
          hint: `${i.warehouse} · ${i.stock} in stock`,
          to: "/admin/inventory",
        })),
      );
    }
    if (can("people")) {
      records.push(
        ...customersList.map((c) => ({
          group: "Customers",
          label: c.name,
          hint: `${c.tier} · ${c.orders} orders`,
          to: "/admin/customers",
        })),
      );
    }

    return [...nav, ...records];
  }, [can]);

  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const entry of entries) {
      const list = map.get(entry.group) ?? [];
      list.push(entry);
      map.set(entry.group, list);
    }
    return [...map.entries()];
  }, [entries]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, orders, payments, SKUs, customers…" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>No matches in this workspace.</CommandEmpty>
        {grouped.map(([group, items], index) => (
          <div key={group}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items.map((item) => (
                <CommandItem
                  key={`${group}-${item.label}-${item.to}`}
                  value={`${item.label} ${item.hint} ${group}`}
                  onSelect={() => {
                    onOpenChange(false);
                    navigate({ to: item.to });
                  }}
                >
                  <span className="truncate">{item.label}</span>
                  <CommandShortcut className="truncate font-sans normal-case">
                    {item.hint}
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}