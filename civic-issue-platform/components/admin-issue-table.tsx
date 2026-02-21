"use client";

import useSWR, { mutate } from "swr";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { STATUSES } from "@/lib/types";
import { Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Issue } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function AdminIssueTable() {
  const { data: issues, isLoading } = useSWR<Issue[]>(
    "/api/issues?sort=created_at&order=desc",
    fetcher
  );

  const [updating, setUpdating] = useState<number | null>(null);

  async function handleStatusChange(issueId: number, newStatus: string) {
    setUpdating(issueId);
    await fetch(`/api/issues/${issueId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        updated_by: "Admin",
        comment: `Status updated to ${newStatus.replace("_", " ")}`,
      }),
    });
    mutate("/api/issues?sort=created_at&order=desc");
    mutate("/api/stats");
    setUpdating(null);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Settings className="h-4 w-4 text-primary" />
        Issue Management
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-3 font-semibold text-muted-foreground">
                ID
              </th>
              <th className="pb-3 pr-3 font-semibold text-muted-foreground">
                Title
              </th>
              <th className="pb-3 pr-3 font-semibold text-muted-foreground">
                Category
              </th>
              <th className="pb-3 pr-3 font-semibold text-muted-foreground">
                Status
              </th>
              <th className="pb-3 pr-3 font-semibold text-muted-foreground">
                Priority
              </th>
              <th className="pb-3 pr-3 font-semibold text-muted-foreground">
                Upvotes
              </th>
              <th className="pb-3 font-semibold text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={7} className="py-4">
                      <div className="h-6 animate-pulse rounded bg-secondary" />
                    </td>
                  </tr>
                ))
              : issues?.map((issue) => (
                  <tr
                    key={issue.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 pr-3 font-mono text-xs text-muted-foreground">
                      #{issue.id}
                    </td>
                    <td className="max-w-[200px] truncate py-3 pr-3 font-medium text-foreground">
                      {issue.title}
                    </td>
                    <td className="py-3 pr-3 capitalize text-muted-foreground">
                      {issue.category.replace("_", " ")}
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-3 pr-3">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      {issue.upvotes}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <select
                          disabled={updating === issue.id}
                          value={issue.status}
                          onChange={(e) =>
                            handleStatusChange(issue.id, e.target.value)
                          }
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
                        >
                          {STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <Link
                          href={`/issues/${issue.id}`}
                          className="rounded-md border border-border p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          title="View details"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
