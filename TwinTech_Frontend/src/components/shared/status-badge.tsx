import { Badge } from "@/components/ui/badge";

const map: Record<string, "success" | "warning" | "destructive" | "soft" | "secondary" | "outline"> = {
  Paid: "success",
  Settled: "success",
  Fulfilled: "success",
  Completed: "success",
  Ready: "success",
  Active: "success",
  Healthy: "success",
  Approved: "success",
  Pending: "warning",
  "Awaiting parts": "warning",
  Diagnosing: "warning",
  Low: "warning",
  "On leave": "warning",
  Processing: "warning",
  Failed: "destructive",
  Refunded: "destructive",
  Out: "destructive",
  Cancelled: "destructive",
  Expired: "destructive",
  "In repair": "soft",
  "Quality check": "soft",
  Received: "secondary",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={map[status] ?? "outline"}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </Badge>
  );
}
