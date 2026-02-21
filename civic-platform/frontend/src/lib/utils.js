export const CATEGORY_META = {
  pothole:       { label: 'Pothole',         icon: '🕳️',  color: '#f97316' },
  water_leakage: { label: 'Water Leakage',   icon: '💧',  color: '#3b82f6' },
  streetlight:   { label: 'Street Light',    icon: '💡',  color: '#eab308' },
  drainage:      { label: 'Drainage',        icon: '🌊',  color: '#6366f1' },
  garbage:       { label: 'Garbage',         icon: '🗑️',  color: '#22c55e' },
  road_damage:   { label: 'Road Damage',     icon: '🚧',  color: '#ef4444' },
  encroachment:  { label: 'Encroachment',    icon: '🏗️',  color: '#a855f7' },
  other:         { label: 'Other',           icon: '📋',  color: '#94a3b8' },
};

export const STATUS_META = {
  pending:      { label: 'Pending',      color: '#64748b', bg: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400' },
  acknowledged: { label: 'Acknowledged', color: '#3b82f6', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  in_progress:  { label: 'In Progress',  color: '#f59e0b', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  resolved:     { label: 'Resolved',     color: '#22c55e', bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  rejected:     { label: 'Rejected',     color: '#ef4444', bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export const PRIORITY_META = {
  low:      { label: 'Low',      color: '#22c55e', cls: 'badge-low' },
  medium:   { label: 'Medium',   color: '#f59e0b', cls: 'badge-medium' },
  high:     { label: 'High',     color: '#f97316', cls: 'badge-high' },
  critical: { label: 'Critical', color: '#ef4444', cls: 'badge-critical' },
};

export const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const timeAgo = (d) => {
  if (!d) return '—';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const getInitials = (name) =>
  name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
