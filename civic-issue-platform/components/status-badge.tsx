import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  reported: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  in_progress: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  resolved: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  dismissed: {
    bg: "bg-zinc-50 border-zinc-200",
    text: "text-zinc-500",
    dot: "bg-zinc-400",
  },
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  low: { bg: "bg-slate-50 border-slate-200", text: "text-slate-600" },
  medium: { bg: "bg-sky-50 border-sky-200", text: "text-sky-700" },
  high: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
  critical: { bg: "bg-red-50 border-red-200", text: "text-red-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.reported;
  const label = status.replace("_", " ");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        style.bg,
        style.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        style.bg,
        style.text
      )}
    >
      {priority}
    </span>
  );
}
