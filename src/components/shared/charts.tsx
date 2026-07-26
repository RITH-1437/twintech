import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("surface-panel p-5", className)}>
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className="h-[260px] w-full">{children}</div>
    </div>
  );
}

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--popover-foreground)",
    boxShadow: "0 12px 32px -8px rgb(15 23 42 / 0.18)",
  },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11, marginBottom: 4 },
} as const;

export function RevenueAreaChart({
  data,
}: {
  data: { month: string; revenue: number; repairs: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Product revenue"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#rev)"
        />
        <Area
          type="monotone"
          dataKey="repairs"
          name="Repair revenue"
          stroke="var(--chart-2)"
          strokeWidth={2}
          fill="url(#rep)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarsChart({
  data,
  dataKey,
  labelKey,
  formatter,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  labelKey: string;
  formatter?: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={labelKey} {...axis} interval={0} tick={{ fontSize: 10 }} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => (formatter ? formatter(v) : v)} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]} fill="var(--chart-1)" maxBarSize={38} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({
  data,
  dataKey,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="var(--chart-5)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--chart-5)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ChannelPieChart({ data }: { data: { name: string; value: number }[] }) {
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={3} stroke="none">
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}%`} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
