"use client";

import useSWR from "swr";
import { IssueCard } from "@/components/issue-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Issue } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function RecentIssues() {
  const { data: issues, isLoading } = useSWR<Issue[]>(
    "/api/issues?sort=created_at&order=desc",
    fetcher
  );

  return (
    <section className="border-t border-border bg-secondary/30 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Recent Reports
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest civic issues reported by citizens
            </p>
          </div>
          <Link
            href="/issues"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-xl border border-border bg-card"
                />
              ))
            : issues
                ?.slice(0, 6)
                .map((issue) => <IssueCard key={issue.id} issue={issue} />)}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/issues"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all reports <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
