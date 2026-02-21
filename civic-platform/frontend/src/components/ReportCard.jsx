import { Link } from 'react-router-dom';
import { CATEGORY_META, STATUS_META, PRIORITY_META, timeAgo } from '../lib/utils';

export default function ReportCard({ report, onUpvote }) {
  const cat = CATEGORY_META[report.category] || CATEGORY_META.other;
  const status = STATUS_META[report.status] || STATUS_META.pending;
  const priority = PRIORITY_META[report.priority] || PRIORITY_META.medium;

  return (
    <div className="card p-5 hover:shadow-lg hover:shadow-black/10 transition-all duration-300 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0 mt-0.5">{cat.icon}</span>
          <div className="min-w-0">
            <Link to={`/report/${report._id}`}
              className="font-semibold text-slate-900 dark:text-white hover:text-civic-600 dark:hover:text-civic-400 transition-colors line-clamp-1 block">
              {report.title}
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{report.reportId}</p>
          </div>
        </div>
        <span className={`${priority.cls} flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full`}>
          {priority.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
        {report.description}
      </p>

      {/* Meta row */}
      <div className="flex items-center flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg}`}>
          {report.status === 'in_progress' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse" />}
          {status.label}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
          📍 {report.location?.city || report.location?.address?.split(',')[0] || 'Unknown'}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(report.createdAt)}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => onUpvote && onUpvote(report._id)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-civic-500 transition-colors">
            <span>▲</span>
            <span>{report.upvotes?.length || 0}</span>
          </button>
          {report.isDuplicate && (
            <span className="text-xs text-purple-500 bg-purple-100 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
              Duplicate
            </span>
          )}
          {report.duplicateCount > 0 && (
            <span className="text-xs text-orange-500 bg-orange-100 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
              +{report.duplicateCount} similar
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{report.assignedDept}</span>
          {/* Priority score bar */}
          <div className="w-16 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${report.priorityScore || 50}%`,
                background: priority.color,
              }} />
          </div>
        </div>
      </div>
    </div>
  );
}
