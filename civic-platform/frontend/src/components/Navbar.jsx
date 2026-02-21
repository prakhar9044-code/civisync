import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../lib/utils';

export default function Navbar({ darkMode, toggleDark }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCitizen = user?.role === 'citizen';

  const links = isCitizen
    ? [
        { to: '/dashboard', label: '📊 Dashboard' },
        { to: '/report', label: '+ Report Issue' },
        { to: '/analytics', label: '📈 Analytics' },
      ]
    : [
        { to: '/admin', label: '🏛️ Dashboard' },
        { to: '/analytics', label: '📈 Analytics' },
      ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#060d1a]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to={isCitizen ? '/dashboard' : '/admin'} className="flex items-center gap-2.5">
          <span className="text-2xl">🏙️</span>
          <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
            Civic<span className="text-civic-500">Pulse</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === to
                  ? 'bg-civic-50 dark:bg-civic-600/20 text-civic-600 dark:text-civic-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user && (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                <div className="w-8 h-8 rounded-full bg-civic-600 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{user.name?.split(' ')[0]}</p>
                  <p className="text-xs text-civic-500 capitalize">{user.role}</p>
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-52 card shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-white/10 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    {user.role === 'citizen' && (
                      <p className="text-xs text-civic-500 mt-1">⭐ {user.points || 0} points</p>
                    )}
                  </div>
                  {links.map(({ to, label }) => (
                    <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
                      {label}
                    </Link>
                  ))}
                  <hr className="my-1 border-slate-200 dark:border-white/10" />
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    → Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
