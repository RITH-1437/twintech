import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { CustomerPage } from "@/components/dash/workspace-page";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { supportTickets } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/support")({
  head: seo(
    "Support tickets — TwinTech",
    "Open, track and reply to TwinTech support tickets across email, phone and live chat channels.",
  ),
  component: CustomerSupport,
});

type Row = (typeof supportTickets)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Ticket", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "subject", header: "Subject", render: (r) => r.subject },
  { key: "channel", header: "Channel", render: (r) => <span className="text-muted-foreground">{r.channel}</span> },
  { key: "agent", header: "Agent", render: (r) => r.agent },
  { key: "opened", header: "Opened", render: (r) => <span className="text-muted-foreground">{r.opened}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function CustomerSupport() {
  return (
    <CustomerPage
      title="Support tickets"
      description="Average first response time: 42 minutes during business hours."
      actions={
        <Button asChild>
          <Link to="/contact">New ticket</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open tickets" value="1" hint="Being worked on" icon={MessageSquare} tone="warning" />
        <StatCard label="Resolved" value="2" delta={100} hint="Last 30 days" icon={MessageSquare} tone="success" />
        <StatCard label="Avg response" value="42m" delta={-18} hint="Faster than target" icon={MessageSquare} />
      </div>
      <DataTable
        rows={supportTickets}
        columns={columns}
        searchKeys={["id", "subject", "agent"]}
        filter={{ label: "Status", key: "status", options: ["Processing", "Approved", "Completed"] }}
        rowKey="id"
      />
    </CustomerPage>
  );
}