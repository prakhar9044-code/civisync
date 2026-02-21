import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { reportsAPI, analyticsAPI, getSocket } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ReportCard from '../components/ReportCard';
import StatsGrid from '../components/StatsGrid';
import IssueMap from '../components/IssueMap';
import { CATEGORY_META, STATUS_META, PRIORITY_META, formatDate } from '../lib/utils';

const STATUS_OPTIONS = ['acknowledged', 'in_progress', 'resolved', 'rejected'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('reports');
  const [updating, setUpdating] = useState({});
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    loadData();
    const socket = getSocket();
    socket.on('new_report', () => { loadData(); toast('🆕 New report submitted!', { icon: '🔔' }); });
    return () => socket.off('new_report');
  }, [statusFilter, priorityFilter]);

  const loadData = async () => {
    try {
      const params = { limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;

      const [rRes, sRes, hRes, dRes] = await Promise.all([
        reportsAPI.getAll(params),
        analyticsAPI.overview(),
        analyticsAPI.hotspots(),
        analyticsAPI.deptPerformance(),
      ]);
      setReports(rRes.data.reports);
      setStats(sRes.data.stats);
      setHotspots(hRes.data.hotspots);
      setDeptData(dRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reportId, status) => {
    setUpdating(p => ({ ...p, [reportId]: true }));
    try {
      await reportsAPI.updateStatus(reportId, { status, note: statusNote || `Status changed to ${status}` });
      toast.success(`Report marked as ${status}`);
      setStatusNote('');
      setSelectedReport(null);
      loadData();
    } catch (_) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(p => ({ ...p, [reportId]: false }));
    }
  };

  const priorityFilters = ['all', 'critical', 'high', 'medium', 'low'];

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Authority Dashboard
              <span className="ml-3 text-sm font-normal text-slate-500 dark:text-slate-400 capitalize">
                {user?.department || user?.role}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and resolve citizen complaints</p>
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-2 rounded-xl text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
            Live Dashboard
          </div>
        </div>

        {/* Stats */}
        <StatsGrid stats={stats} loading={loading} />

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-fit">
          {[
            { key: 'reports', label: '📋 All Complaints' },
            { key: 'map', label: '🗺️ Issue Map' },
            { key: 'departments', label: '🏛️ Departments' },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t.key
                  ? 'bg-white dark:bg-white/10 text-civic-600 dark:text-civic-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Complaints tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 self-center">Status:</span>
                {['all', 'pending', 'acknowledged', 'in_progress', 'resolved', 'rejected'].map(f => (
                  <button key={f} onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                      statusFilter === f ? 'bg-civic-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}>
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 self-center">Priority:</span>
                {priorityFilters.map(f => (
                  <button key={f} onClick={() => setPriorityFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                      priorityFilter === f ? 'bg-civic-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Report table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                    <tr>
                      {['ID', 'Title / Category', 'Location', 'Priority', 'Status', 'Reported', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {loading
                      ? [...Array(5)].map((_, i) => (
                          <tr key={i}>
                            {[...Array(7)].map((_, j) => (
                              <td key={j} className="px-4 py-3">
                                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded shimmer" />
                              </td>
                            ))}
                          </tr>
                        ))
                      : reports.map(r => {
                          const cat = CATEGORY_META[r.category] || CATEGORY_META.other;
                          const status = STATUS_META[r.status] || STATUS_META.pending;
                          const priority = PRIORITY_META[r.priority] || PRIORITY_META.medium;
                          return (
                            <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.reportId}</td>
                              <td className="px-4 py-3 max-w-xs">
                                <div className="flex items-center gap-2">
                                  <span>{cat.icon}</span>
                                  <div>
                                    <p className="font-semibold text-slate-900 dark:text-white truncate">{r.title}</p>
                                    <p className="text-xs text-slate-400">{cat.label}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-500 max-w-[120px] truncate">
                                {r.location?.city || r.location?.address?.split(',')[0] || '—'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`${priority.cls} text-xs`}>{priority.label}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg}`}>
                                  {status.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-400">{formatDate(r.createdAt)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Link to={`/report/${r._id}`}
                                    className="text-xs text-civic-500 hover:text-civic-600 font-medium">
                                    View
                                  </Link>
                                  <select
                                    value=""
                                    onChange={e => {
                                      if (e.target.value) updateStatus(r._id, e.target.value);
                                    }}
                                    disabled={updating[r._id]}
                                    className="text-xs bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 cursor-pointer">
                                    <option value="">Update →</option>
                                    {STATUS_OPTIONS.map(s => (
                                      <option key={s} value={s} disabled={s === r.status}>
                                        {s.replace('_', ' ')}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    }
                  </tbody>
                </table>
                {!loading && reports.length === 0 && (
                  <div className="text-center py-12 text-slate-400">No complaints found for the selected filters</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map tab */}
        {activeTab === 'map' && (
          <div className="card p-4 space-y-3">
            <h2 className="font-semibold text-slate-900 dark:text-white">Active Issue Hotspots</h2>
            <IssueMap reports={hotspots} height="550px" />
          </div>
        )}

        {/* Departments tab */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Department Performance</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deptData.map(d => {
                const rate = d.total ? ((d.resolved / d.total) * 100).toFixed(0) : 0;
                return (
                  <div key={d._id} className="card p-5">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">{d._id || 'Unknown'}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Total</span><span className="font-semibold text-slate-900 dark:text-white">{d.total}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Pending</span><span className="font-semibold text-amber-500">{d.pending}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Resolved</span><span className="font-semibold text-green-500">{d.resolved}</span>
                      </div>
                      {d.critical > 0 && (
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Critical</span><span className="font-semibold text-red-500">{d.critical}</span>
                        </div>
                      )}
                    </div>
                    {/* Resolution rate bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Resolution Rate</span><span className="font-semibold">{rate}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
