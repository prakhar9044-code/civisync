export type Issue = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  reporter_name: string;
  reporter_email: string | null;
  reporter_phone: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  image_url: string | null;
  department: string | null;
  admin_notes: string | null;
  upvotes: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export type IssueUpdate = {
  id: number;
  issue_id: number;
  old_status: string | null;
  new_status: string;
  comment: string | null;
  updated_by: string;
  created_at: string;
};

export const CATEGORIES = [
  { value: "pothole", label: "Pothole", icon: "circle-alert" },
  { value: "water_leak", label: "Water Leak", icon: "droplets" },
  { value: "streetlight", label: "Streetlight", icon: "lightbulb" },
  { value: "drainage", label: "Drainage", icon: "waves" },
  { value: "garbage", label: "Garbage", icon: "trash-2" },
  { value: "road_damage", label: "Road Damage", icon: "construction" },
  { value: "sewage", label: "Sewage", icon: "pipette" },
  { value: "other", label: "Other", icon: "help-circle" },
] as const;

export const STATUSES = [
  { value: "reported", label: "Reported", color: "bg-amber-500" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { value: "resolved", label: "Resolved", color: "bg-emerald-500" },
  { value: "dismissed", label: "Dismissed", color: "bg-zinc-400" },
] as const;

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
] as const;
