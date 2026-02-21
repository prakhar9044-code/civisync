import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';
import { CATEGORY_META, STATUS_META, PRIORITY_META, formatDate, timeAgo } from '../lib/utils';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'acknowledged', 'in_progress', 'resolved'];

export default function ReportDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusForm, setStatusForm] = useState({ status: '', note: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    reportsAPI.getById(id)
      .then(res => { setReport(res.data.report); setLoading(false); })
      .catch(() => navigate(-1));
  }, [id]);

  const updateStatus = async () => {
    if (!statusForm.status) return;
    setUpdating(true);
    try {
      const res = await reportsAPI.updateStatus(id, statusForm);
      setReport(res.data.report);
      toast.success('Status updated!');
      setStatusForm({ status: '', note: '' });
    } catch (_) { toast.error('Failed to update'); }
    setUpdating(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-civic-500/30 border-t-civic-500 rounded-full animate-spin" />
    </div>
  );

  if (!report) return null;

  const cat = CATEGORY_META[report.category] || CATEGORY_META.other;
  const status = STATUS_META[report.status] || STATUS_META.pending;
  const priority = PRIORITY_META[report.priority] || PRIORITY_META.medium;
  const isAuthority = user?.role === 'authority' || user?.role === 'admin';
  const currentStep = STATUS_STEPS.indexOf(report.status);

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn-ghost mb-4 text-sm">← Back</button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <div className="card p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">{report.title}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <code className="text-xs bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded font-mono">{report.reportId}</code>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg}`}>
                      {status.label}
                    </span>
                    <span className={`${priority.cls} text-xs`}>{priority.label}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{report.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Category</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{cat.label}</p>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Department</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{report.assignedDept || '—'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Location</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{report.location?.address || `${report.location?.lat}, ${report.location?.lng}`}</p>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Reported</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{formatDate(report.createdAt)}</p>
                </div>
              </div>

              {/* AI score */}
              {report.aiConfidence && (
                <div className="mt-4 flex items-center gap-3 bg-civic-50 dark:bg-civic-600/10 rounded-xl p-3">
                  <span className="text-lg">🤖</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-civic-600 dark:text-civic-400">AI Priority Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-civic-200 dark:bg-civic-900/50 rounded-full overflow-hidden">
                        <div className="h-full bg-civic-500 rounded-full" style={{ width: `${report.priorityScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-civic-600 dark:text-civic-400">{report.priorityScore}/100</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{report.aiConfidence}% confident</span>
                </div>
              )}

              {/* Media */}
              {report.mediaUrls?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Evidence</p>
                  <div className="grid grid-cols-3 gap-2">
                    {report.mediaUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} alt="" className="w-full aspect-square object-cover rounded-xl hover:opacity-80 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Upvotes */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center gap-4">
                <button onClick={() => reportsAPI.upvote(report._id).then(() => setReport(p => ({ ...p, upvotes: p.upvotes?.includes(user._id) ? p.upvotes.filter(u => u !== user._id) : [...(p.upvotes || []), user._id] })))}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-civic-500 transition-colors">
                  ▲ {report.upvotes?.length || 0} community votes
                </button>
                {report.isDuplicate && <span className="text-xs text-purple-500 bg-purple-100 dark:bg-purple-900/20 px-2.5 py-1 rounded-full">Duplicate issue</span>}
                {report.duplicateCount > 0 && <span className="text-xs text-orange-500">+{report.duplicateCount} similar reports</span>}
              </div>
            </div>

            {/* Status timeline */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-5">Resolution Progress</h2>
              <div className="flex items-center mb-6">
                {STATUS_STEPS.map((s, i) => {
                  const done = i <= currentStep && report.status !== 'rejected';
                  const active = i === currentStep && report.status !== 'rejected';
                  const sm = STATUS_META[s];
                  return (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                          done ? 'bg-civic-500 border-civic-500 text-white' : 'bg-transparent border-slate-300 dark:border-white/20 text-slate-400'
                        } ${active ? 'ring-4 ring-civic-500/20' : ''}`}>
                          {done ? (active ? '●' : '✓') : i + 1}
                        </div>
                        <span className="text-xs mt-1.5 text-slate-500 capitalize">{s.replace('_', ' ')}</span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mb-5 transition-all ${i < currentStep ? 'bg-civic-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                      )}
                    </div>
                  );
                })}
                {report.status === 'rejected' && (
                  <div className="ml-auto text-sm text-red-500 font-semibold">✕ Rejected</div>
                )}
              </div>

              {/* History */}
              <div className="space-y-3">
                {report.statusHistory?.slice().reverse().map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-civic-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">{h.note}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{timeAgo(h.timestamp)} · by {h.updatedBy?.name || 'System'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Authority action panel */}
            {isAuthority && (
              <div className="card p-6">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Update Status</h2>
                <div className="space-y-3">
                  <select className="input" value={statusForm.status} onChange={e => setStatusForm(p => ({ ...p, status: e.target.value }))}>
                    <option value="">Select new status</option>
                    {['acknowledged', 'in_progress', 'resolved', 'rejected'].map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <input className="input" placeholder="Update note (optional)"
                    value={statusForm.note} onChange={e => setStatusForm(p => ({ ...p, note: e.target.value }))} />
                  <button onClick={updateStatus} disabled={!statusForm.status || updating} className="btn-primary w-full">
                    {updating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Reporter info */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Reporter</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-civic-600 flex items-center justify-center text-white font-bold text-sm">
                  {report.userId?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{report.userId?.name}</p>
                  <p className="text-xs text-slate-400">{report.userId?.email}</p>
                  {report.userId?.points != null && (
                    <p className="text-xs text-civic-500">⭐ {report.userId.points} points</p>
                  )}
                </div>
              </div>
              {report.userId?.badges?.length > 0 && (
                <div className="mt-3 flex gap-1 flex-wrap">
                  {report.userId.badges.map((b, i) => <span key={i} title={b.name}>{b.icon}</span>)}
                </div>
              )}
            </div>

            {/* Chat */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/10">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">💬 Communication</h3>
                <p className="text-xs text-slate-400 mt-0.5">Chat with the authority</p>
              </div>
              <ChatBox reportId={report._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
