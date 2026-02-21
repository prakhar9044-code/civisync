"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "oklch(0.45 0.15 250)",
  "oklch(0.55 0.14 160)",
  "oklch(0.65 0.20 45)",
  "oklch(0.60 0.22 25)",
  "oklch(0.75 0.15 85)",
  "oklch(0.50 0.18 300)",
  "oklch(0.70 0.12 200)",
  "oklch(0.55 0.10 120)",
];

export function CategoryChart({
  data,
  isLoading,
}: {
  data: { category: string; count: number }[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading || !data) {
    return (
      <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
    );
  }

  const chartData = data.map((d) => ({
    name: d.category.replace("_", " "),
    count: Number(d.count),
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Issues by Category
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11 }}
            width={75}
            className="capitalize"
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
