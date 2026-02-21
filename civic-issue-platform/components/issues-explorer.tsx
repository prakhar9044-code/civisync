"use client";

import { useState } from "react";
import useSWR from "swr";
import { IssueCard } from "@/components/issue-card";
import { CATEGORIES, STATUSES } from "@/lib/types";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Issue } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function IssuesExplorer() {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");

  const queryStr = new URLSearchParams({
    ...(status !== "all" && { status }),
    ...(category !== "all" && { category }),
    ...(search && { search }),
    sort: sortBy,
    order: "desc",
  }).toString();

  const { data: issues, isLoading } = useSWR<Issue[]>(
    `/api/issues?${queryStr}`,
    fetcher
  );

  return (
    <div className="mt-8 space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues by title, description, or location..."
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="created_at">Newest First</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {isLoading ? "Loading..." : `${issues?.length ?? 0} issues found`}
        </span>
      </div>

      {/* Issues Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-xl border border-border bg-card"
              />
            ))
          : issues?.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
      </div>

      {!isLoading && issues?.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-foreground">
            No issues found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
