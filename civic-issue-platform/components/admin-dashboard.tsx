"use client";

import useSWR from "swr";
import {
  FileText,
  Loader2 as Loader2Icon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { AdminIssueTable } from "@/components/admin-issue-table";
import { CategoryChart } from "@/components/category-chart";
import { DepartmentTable } from "@/components/department-table";
import { RecentActivityFeed } from "@/components/recent-activity-feed";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function AdminDashboard() {
  const { data: stats, isLoading } = useSWR("/api/stats", fetcher);

  const cards = [
    {
      label: "Total Reports",
      value: stats?.total,
      icon: FileText,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Pending",
      value: stats?.reported,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "In Progress",
      value: stats?.inProgress,
      icon: Loader2Icon,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Resolved",
      value: stats?.resolved,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Dismissed",
      value: stats?.dismissed,
      icon: XCircle,
      color: "text-zinc-500 bg-zinc-100",
    },
    {
      label: "Critical",
      value: stats?.critical,
      icon: AlertTriangle,
      color: "text-red-600 bg-red-50",
    },
    {
      label: "Resolution Rate",
      value: stats?.resolutionRate ? `${stats.resolutionRate}%` : "-",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Avg. Resolution",
      value: stats?.avgResolutionDays !== "N/A" ? `${stats?.avgResolutionDays}d` : "-",
      icon: BarChart3,
      color: "text-primary bg-primary/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.color}`}
              >
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">
                  {isLoading ? "..." : (card.value ?? "-")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {card.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChart data={stats?.byCategory} isLoading={isLoading} />
        <DepartmentTable data={stats?.byDepartment} isLoading={isLoading} />
      </div>

      {/* Recent Activity */}
      <RecentActivityFeed data={stats?.recentActivity} isLoading={isLoading} />

      {/* Issues Management Table */}
      <AdminIssueTable />
    </div>
  );
}
