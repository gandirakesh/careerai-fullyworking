import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bell, LogOut, User, Briefcase, LayoutDashboard,
  ChevronDown, Menu, X, Plus, FileText, Building2
} from 'lucide-react';
import api from '../../lib/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch {}
  };

  const handleNotifClick = () => {
    setNotifOpen((v) => !v);
    if (!notifOpen) fetchNotifications();
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unread = notifications.filter((n) => !n.read).length;
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg">
              <span className="font-display text-white text-sm font-bold">C</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 opacity-0 group-hover:opacity-40 blur-lg transition-opacity" />
            </div>
            <span className="font-display font-bold text-lg text-white hidden sm:block">
              Career<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/jobs" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/jobs') ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              Browse Jobs
            </Link>
            {user?.role === 'job_seeker' && (
              <>
                <Link to="/dashboard" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  Dashboard
                </Link>
                <Link to="/applications" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/applications') ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  Applications
                </Link>
                <Link to="/resume" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/resume') ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  Resume
                </Link>
                <Link to="/portfolio" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/portfolio') ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  Portfolio
                </Link>
              </>
            )}
            {user?.role === 'recruiter' && (
              <>
                <Link to="/recruiter" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/recruiter') ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  Dashboard
                </Link>
                <Link to="/recruiter/jobs" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/recruiter/jobs') ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  My Jobs
                </Link>
                <Link to="/recruiter/post-job" className="btn-primary text-sm py-2 flex items-center gap-1.5 ml-1">
                  <Plus className="w-4 h-4" /> Post Job
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button onClick={handleNotifClick} className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Bell className="w-5 h-5" />
                    {unread > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-400" />
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 glass rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                        <h3 className="font-display font-semibold text-sm text-white">Notifications</h3>
                        {unread > 0 && (
                          <button onClick={markAllRead} className="text-xs text-sky-400 hover:text-sky-300">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-slate-500 text-sm text-center py-6">No notifications yet</p>
                        ) : (
                          notifications.map((n, i) => (
                            <div key={i} className={`px-4 py-3 border-b border-white/[0.04] ${!n.read ? 'bg-sky-500/5' : ''}`}>
                              <p className="text-sm text-slate-300">{n.message}</p>
                              <p className="text-xs text-slate-600 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button onClick={() => setUserMenuOpen((v) => !v)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                      {user.email[0].toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 glass rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <p className="text-xs font-medium text-sky-400 capitalize mt-0.5">{user.role.replace('_', ' ')}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to={user.role === 'recruiter' ? '/recruiter/profile' : '/profile'}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2">Sign in</Link>
                <Link to="/signup" className="btn-primary text-sm py-2">Get started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/[0.06] px-4 py-4 flex flex-col gap-1">
          <Link to="/jobs" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>
            <Briefcase className="w-4 h-4" /> Browse Jobs
          </Link>
          {user?.role === 'job_seeker' && (
            <>
              <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/applications" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                <FileText className="w-4 h-4" /> Applications
              </Link>
              <Link to="/resume" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                <FileText className="w-4 h-4" /> Resume
              </Link>
              <Link to="/portfolio" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                <FileText className="w-4 h-4" /> Portfolio
              </Link>
            </>
          )}
          {user?.role === 'recruiter' && (
            <>
              <Link to="/recruiter" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/recruiter/jobs" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                <Building2 className="w-4 h-4" /> My Jobs
              </Link>
              <Link to="/recruiter/post-job" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-sky-400" onClick={() => setMenuOpen(false)}>
                <Plus className="w-4 h-4" /> Post Job
              </Link>
            </>
          )}
          {!user && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-white/[0.06]">
              <Link to="/login" className="btn-secondary text-sm flex-1 text-center py-2.5" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/signup" className="btn-primary text-sm flex-1 text-center py-2.5" onClick={() => setMenuOpen(false)}>Get started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}