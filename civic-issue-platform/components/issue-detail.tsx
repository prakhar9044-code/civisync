"use client";

import useSWR, { mutate } from "swr";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import {
  ArrowLeft,
  MapPin,
  Clock,
  ThumbsUp,
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Issue, IssueUpdate } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function IssueDetail({ id }: { id: string }) {
  const { data, isLoading } = useSWR<Issue & { updates: IssueUpdate[] }>(
    `/api/issues/${id}`,
    fetcher
  );
  const [upvoting, setUpvoting] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-lg font-semibold text-foreground">Issue not found</p>
        <Link href="/issues" className="mt-2 text-sm text-primary hover:underline">
          Back to issues
        </Link>
      </div>
    );
  }

  async function handleUpvote() {
    setUpvoting(true);
    await fetch(`/api/issues/${id}/upvote`, { method: "POST" });
    mutate(`/api/issues/${id}`);
    setUpvoting(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/issues"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to issues
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start gap-3">
          <StatusBadge status={data.status} />
          <PriorityBadge priority={data.priority} />
          <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize text-secondary-foreground">
            {data.category.replace("_", " ")}
          </span>
        </div>
        <h1 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
          {data.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{data.description}</p>

        {/* Meta Info */}
        <div className="mt-6 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
          {data.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {data.address}
            </div>
          )}
          {data.latitude && data.longitude && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              {data.latitude}, {data.longitude}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            Reported {new Date(data.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          {data.department && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4 shrink-0" />
              {data.department}
            </div>
          )}
        </div>

        {/* Reporter */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {data.reporter_name}
          </span>
          {data.reporter_email && (
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {data.reporter_email}
            </span>
          )}
          {data.reporter_phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {data.reporter_phone}
            </span>
          )}
        </div>

        {/* Upvote */}
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
          <button
            onClick={handleUpvote}
            disabled={upvoting}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50"
          >
            <ThumbsUp className="h-4 w-4" />
            Upvote ({data.upvotes})
          </button>
          <span className="text-xs text-muted-foreground">
            Upvote to help prioritize this issue
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      {data.updates && data.updates.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <MessageSquare className="h-5 w-5 text-primary" />
            Status Updates
          </h2>
          <div className="space-y-4">
            {data.updates.map((update) => (
              <div
                key={update.id}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={update.new_status} />
                    {update.old_status && (
                      <span className="text-xs text-muted-foreground">
                        from{" "}
                        <span className="capitalize">
                          {update.old_status.replace("_", " ")}
                        </span>
                      </span>
                    )}
                  </div>
                  {update.comment && (
                    <p className="mt-2 text-sm text-foreground">
                      {update.comment}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{update.updated_by}</span>
                    <span>
                      {new Date(update.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
