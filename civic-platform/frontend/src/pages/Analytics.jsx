import { useState, useEffect } from 'react';
import { analyticsAPI } from '../lib/api';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement,
  PointElement, LineElement, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { CATEGORY_META } from '../lib/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

const isDark = () => document.documentElement.classList.contains('dark');

const CHART_COLORS = ['#0c8de8','#3b82f6','#8b5cf6','#ec4899','#f59e0b','#22c55e','#ef4444','#06b6d4'];

export default function Analytics() {
  const [catData, setCatData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.byCategory(),
      analyticsAPI.byStatus(),
      analyticsAPI.trend(),
      analyticsAPI.leaderboard(),
    ]).then(([c, s, t, l]) => {
      setCatData(c.data.data);
      setStatusData(s.data.data);
      setTrendData(t.data.data);
      setLeaderboard(l.data.leaderboard);
      setLoading(false);
    });
  }, []);

  const dark = isDark();
  const textColor = dark ? '#8899bb' : '#64748b';
  const gridColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans' } } } },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } },
    }
  };

  const barData = {
    labels: catData.map(d => CATEGORY_META[d._id]?.label || d._id),
    datasets: [
      { label: 'Total', data: catData.map(d => d.count), backgroundColor: CHART_COLORS, borderRadius: 6 },
      { label: 'Resolved', data: catData.map(d => d.resolved), backgroundColor: '#22c55e', borderRadius: 6 },
    ]
  };

  const doughnutData = {
    labels: statusData.map(d => d._id?.replace('_', ' ')),
    datasets: [{
      data: statusData.map(d => d.count),
      backgroundColor: ['#64748b', '#3b82f6', '#f59e0b', '#22c55e', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const lineData = {
    labels: trendData.map(d => d._id),
    datasets: [
      {
        label: 'Reports Submitted',
        data: trendData.map(d => d.count),
        borderColor: '#0c8de8',
        backgroundColor: 'rgba(12,141,232,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: 'Resolved',
        data: trendData.map(d => d.resolved),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      }
    ]
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Platform-wide issue trends and insights</p>
        </div>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => <div key={i} className="card h-72 shimmer" />)}
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Category breakdown */}
              <div className="card p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Issues by Category</h2>
                <div style={{ height: '260px' }}>
                  <Bar data={barData} options={{ ...commonOptions, plugins: { ...commonOptions.plugins, legend: { display: true, labels: { color: textColor } } } }} />
                </div>
              </div>

              {/* Status distribution */}
              <div className="card p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Status Distribution</h2>
                <div style={{ height: '260px' }} className="flex items-center justify-center">
                  <Doughnut data={doughnutData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { legend: { position: 'right', labels: { color: textColor, font: { family: 'Plus Jakarta Sans' }, padding: 12 } } }
                  }} />
                </div>
              </div>

              {/* 30-day trend */}
              <div className="card p-5 lg:col-span-2">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-4">30-Day Trend</h2>
                <div style={{ height: '240px' }}>
                  <Line data={lineData} options={{ ...commonOptions, scales: { x: { ticks: { color: textColor, maxRotation: 45 }, grid: { color: gridColor } }, y: { ticks: { color: textColor }, grid: { color: gridColor } } } }} />
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-white/10">
                <h2 className="font-semibold text-slate-900 dark:text-white">🏆 Civic Champions Leaderboard</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5">
                    <tr>
                      {['Rank', 'Citizen', 'Points', 'Reports', 'Resolved', 'Badges'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {leaderboard.map((u, i) => (
                      <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3">
                          <span className={`text-lg font-bold ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                        <td className="px-5 py-3 font-bold text-civic-500">{u.points}</td>
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{u.reportsSubmitted}</td>
                        <td className="px-5 py-3 text-green-600 dark:text-green-400">{u.reportsResolved || 0}</td>
                        <td className="px-5 py-3">{u.badges?.map((b, j) => <span key={j} title={b.name}>{b.icon}</span>)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
