"use client";

import useSWR from "swr";
import { FileText, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function StatsBar() {
  const { data, isLoading } = useSWR("/api/stats", fetcher);

  const stats = [
    {
      label: "Total Reports",
      value: data?.total ?? "-",
      icon: FileText,
      color: "text-primary bg-primary/10",
    },
    {
      label: "In Progress",
      value: data?.inProgress ?? "-",
      icon: Loader2,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Resolved",
      value: data?.resolved ?? "-",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Critical",
      value: data?.critical ?? "-",
      icon: AlertTriangle,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <section className="border-y border-border bg-card px-4 py-10 lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-border bg-background p-4"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? "..." : stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
