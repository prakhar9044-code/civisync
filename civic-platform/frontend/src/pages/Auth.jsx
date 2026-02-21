import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen', department: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user;
      if (mode === 'login') {
        user = await login(form.email, form.password);
      } else {
        user = await register(form);
      }
      toast.success(`Welcome${user.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋`);
      navigate(user.role === 'citizen' ? '/dashboard' : '/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email, password) => {
    setForm(p => ({ ...p, email, password }));
    setMode('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)' }}>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-civic-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-civic-400/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fadeUp">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-civic-600 mb-4 shadow-lg shadow-civic-600/30">
            <span className="text-3xl">🏙️</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">CivicPulse</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Smart Civic Issue Reporting Platform</p>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-2xl shadow-black/20">
          {/* Tab toggle */}
          <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-6">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  mode === m
                    ? 'bg-white dark:bg-white/10 text-civic-600 dark:text-civic-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}>
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input className="input" placeholder="Your full name" value={form.name}
                  onChange={e => set('name', e.target.value)} required />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input className="input" type="email" placeholder="you@email.com" value={form.email}
                onChange={e => set('email', e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => set('password', e.target.value)} required minLength={6} />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
                  <select className="input" value={form.role} onChange={e => set('role', e.target.value)}>
                    <option value="citizen">Citizen</option>
                    <option value="authority">Authority / Officer</option>
                  </select>
                </div>
                {form.role === 'authority' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                    <select className="input" value={form.department} onChange={e => set('department', e.target.value)}>
                      <option value="">Select Department</option>
                      <option>Roads & Infrastructure</option>
                      <option>Water & Sanitation</option>
                      <option>Electricity & Public Works</option>
                      <option>Solid Waste Management</option>
                      <option>Town Planning</option>
                      <option>General Administration</option>
                    </select>
                  </div>
                )}
              </>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2 py-3">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                : mode === 'login' ? '→ Sign In' : '→ Create Account'
              }
            </button>
          </form>

          {/* Quick demo logins */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10">
            <p className="text-xs text-center text-slate-400 mb-3 font-medium uppercase tracking-wide">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '👤 Citizen', email: 'priya@email.com', pass: 'pass123' },
                { label: '🏛️ Authority', email: 'authority@civic.gov.in', pass: 'auth123' },
                { label: '🔑 Admin', email: 'admin@civic.gov.in', pass: 'admin123' },
              ].map(({ label, email, pass }) => (
                <button key={email} onClick={() => quickLogin(email, pass)}
                  className="text-xs py-2 px-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 transition-all text-center font-medium">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
