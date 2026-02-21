"use client";

import { StatusBadge } from "@/components/status-badge";
import { Activity } from "lucide-react";

type ActivityItem = {
  id: number;
  issue_id: number;
  issue_title: string;
  old_status: string | null;
  new_status: string;
  comment: string | null;
  updated_by: string;
  created_at: string;
};

export function RecentActivityFeed({
  data,
  isLoading,
}: {
  data: ActivityItem[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading || !data) {
    return (
      <div className="h-40 animate-pulse rounded-xl border border-border bg-card" />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Activity className="h-4 w-4 text-primary" />
        Recent Activity
      </h3>
      <div className="space-y-3">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        )}
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
          >
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">
                <span className="font-medium">{item.issue_title}</span>
                {" "}updated to <StatusBadge status={item.new_status} />
              </p>
              {item.comment && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.comment}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {item.updated_by} &middot;{" "}
                {new Date(item.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
