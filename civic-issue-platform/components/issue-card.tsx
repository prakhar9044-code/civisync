"use client";

import Link from "next/link";
import type { Issue } from "@/lib/types";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import {
  MapPin,
  Clock,
  ThumbsUp,
  ChevronRight,
  AlertTriangle,
  Droplets,
  Lightbulb,
  Waves,
  Trash2,
  Construction,
  Pipette,
  HelpCircle,
} from "lucide-react";

const CATEGORY_ICON: Record<string, React.ElementType> = {
  pothole: AlertTriangle,
  water_leak: Droplets,
  streetlight: Lightbulb,
  drainage: Waves,
  garbage: Trash2,
  road_damage: Construction,
  sewage: Pipette,
  other: HelpCircle,
};

export function IssueCard({ issue }: { issue: Issue }) {
  const Icon = CATEGORY_ICON[issue.category] || HelpCircle;
  const timeAgo = getTimeAgo(issue.created_at);

  return (
    <Link href={`/issues/${issue.id}`} className="group block">
      <div className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
              {issue.title}
            </h3>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {issue.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {issue.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="max-w-[180px] truncate">{issue.address}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {issue.upvotes}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
