export default function StatsGrid({ stats, loading }) {
  const items = [
    { label: 'Total Reports',     value: stats?.total || 0,               icon: '📋', color: 'from-civic-600/20 to-civic-400/10', text: 'text-civic-400' },
    { label: 'Pending',           value: stats?.pending || 0,             icon: '⏳', color: 'from-slate-400/20 to-slate-300/10', text: 'text-slate-400' },
    { label: 'In Progress',       value: stats?.inProgress || 0,          icon: '🔧', color: 'from-amber-500/20 to-amber-400/10', text: 'text-amber-400' },
    { label: 'Resolved',          value: stats?.resolved || 0,            icon: '✅', color: 'from-green-500/20 to-green-400/10', text: 'text-green-400' },
    { label: 'Resolution Rate',   value: `${stats?.resolutionRate || 0}%`,icon: '📊', color: 'from-purple-500/20 to-purple-400/10', text: 'text-purple-400' },
    { label: 'Avg. Resolution',   value: `${stats?.avgResolutionDays || 0}d`, icon: '⏱️', color: 'from-rose-500/20 to-rose-400/10', text: 'text-rose-400' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {items.map(({ label, value, icon, color, text }) => (
        <div key={label} className={`card p-4 bg-gradient-to-br ${color} relative overflow-hidden`}>
          <div className="text-2xl mb-2">{icon}</div>
          <p className={`text-2xl font-bold ${text} ${loading ? 'shimmer rounded' : ''}`}>
            {loading ? '—' : value}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{label}</p>
        </div>
      ))}
    </div>
  );
}
