import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { reportsAPI, analyticsAPI, getSocket } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ReportCard from '../components/ReportCard';
import StatsGrid from '../components/StatsGrid';
import IssueMap from '../components/IssueMap';

const FILTERS = ['all', 'pending', 'acknowledged', 'in_progress', 'resolved'];

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('reports'); // reports | map | leaderboard

  useEffect(() => {
    loadData();

    const socket = getSocket();
    socket.on('status_update', (update) => {
      toast(`📣 Report ${update.reportRef}: ${update.status}`, { icon: '🔔' });
      loadData();
    });

    return () => socket.off('status_update');
  }, []);

  const loadData = async () => {
    try {
      const [rRes, sRes, hRes, lRes] = await Promise.all([
        reportsAPI.getAll({ limit: 50 }),
        analyticsAPI.overview(),
        analyticsAPI.hotspots(),
        analyticsAPI.leaderboard(),
      ]);
      setReports(rRes.data.reports);
      setStats(sRes.data.stats);
      setHotspots(hRes.data.hotspots);
      setLeaderboard(lRes.data.leaderboard);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await reportsAPI.upvote(id);
      setReports(prev => prev.map(r =>
        r._id === id
          ? { ...r, upvotes: r.upvotes?.includes(user._id) ? r.upvotes.filter(u => u !== user._id) : [...(r.upvotes || []), user._id] }
          : r
      ));
    } catch (_) {}
  };

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Good day, <span className="text-civic-500">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Track your civic reports and city issues</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Gamification mini widget */}
            <div className="card px-4 py-3 flex items-center gap-3">
              <div className="text-2xl">⭐</div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.points || 0} pts</p>
                <p className="text-xs text-slate-400">{user?.badges?.length || 0} badges</p>
              </div>
            </div>
            <Link to="/report" className="btn-primary flex items-center gap-2">
              <span>+</span> Report Issue
            </Link>
          </div>
        </div>

        {/* Stats */}
        <StatsGrid stats={stats} loading={loading} />

        {/* Badges row */}
        {user?.badges?.length > 0 && (
          <div className="card p-4 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Badges:</span>
            {user.badges.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full text-sm font-semibold">
                {b.icon} {b.name}
              </span>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-fit">
          {[
            { key: 'reports', label: '📋 My Reports' },
            { key: 'map', label: '🗺️ Issue Map' },
            { key: 'leaderboard', label: '🏆 Leaderboard' },
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

        {/* Reports tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                    filter === f
                      ? 'bg-civic-600 text-white'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15'
                  }`}>
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card p-5 h-40 shimmer" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-5xl mb-4">📭</p>
                <p className="font-semibold text-slate-700 dark:text-slate-300">No reports yet</p>
                <p className="text-sm text-slate-400 mt-1">Be the change — report your first civic issue</p>
                <Link to="/report" className="btn-primary inline-flex mt-4">+ Report an Issue</Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map(r => (
                  <ReportCard key={r._id} report={r} onUpvote={handleUpvote} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map tab */}
        {activeTab === 'map' && (
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">City Issue Hotspots</h2>
              <span className="text-xs text-slate-400">{hotspots.length} active issues</span>
            </div>
            <IssueMap reports={hotspots} height="500px" />
          </div>
        )}

        {/* Leaderboard tab */}
        {activeTab === 'leaderboard' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-white/10">
              <h2 className="font-semibold text-slate-900 dark:text-white">🏆 Top Civic Reporters</h2>
              <p className="text-sm text-slate-400 mt-0.5">Citizens making a difference</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {leaderboard.map((u, i) => (
                <div key={u._id} className={`flex items-center gap-4 px-5 py-3.5 ${u._id === user?._id ? 'bg-civic-50 dark:bg-civic-600/10' : ''}`}>
                  <span className={`text-lg font-bold w-6 text-center ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {i + 1}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-civic-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {u.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{u.name} {u._id === user?._id && '(You)'}</p>
                    <div className="flex gap-2 mt-0.5">
                      {u.badges?.slice(0, 3).map((b, j) => <span key={j} title={b.name}>{b.icon}</span>)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-civic-500">{u.points}</p>
                    <p className="text-xs text-slate-400">{u.reportsSubmitted} reports</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
