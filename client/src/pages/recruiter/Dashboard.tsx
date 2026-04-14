import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { Job, Application } from '../../types';
import { Briefcase, Users, TrendingUp, Plus, ArrowRight, Loader2, Eye } from 'lucide-react';

export default function RecruiterDashboard() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recentApps, setRecentApps] = useState<{ app: Application; job: Job }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/recruiter/mine').then(async ({ data }) => {
      setJobs(data);
      // Fetch recent applicants for each job
      const allApps: { app: Application; job: Job }[] = [];
      await Promise.all(
        data.slice(0, 3).map(async (job: Job) => {
          try {
            const r = await api.get(`/jobs/${job._id}/applications`);
            r.data.applications.slice(0, 2).forEach((app: Application) => {
              allApps.push({ app, job });
            });
          } catch {}
        })
      );
      allApps.sort((a, b) => new Date(b.app.createdAt).getTime() - new Date(a.app.createdAt).getTime());
      setRecentApps(allApps.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const totalApplicants = jobs.reduce((s, j) => s + j.applicantCount, 0);
  const activeJobs = jobs.filter((j) => j.status === 'active').length;

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto animate-in">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm font-mono mb-1">— RECRUITER HQ</p>
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome back, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'Recruiter'}</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{profile?.companyName || 'Your company'} · Hiring dashboard</p>
        </div>
        <Link to="/recruiter/post-job" className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Active Jobs', value: activeJobs, icon: Briefcase, color: 'text-sky-400' },
          { label: 'Total Jobs', value: jobs.length, icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Total Applicants', value: totalApplicants, icon: Users, color: 'text-green-400' },
          { label: 'Avg. Applicants', value: jobs.length ? Math.round(totalApplicants / jobs.length) : 0, icon: TrendingUp, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="card">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="font-display text-2xl font-bold text-white">{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Your Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-white">Your Job Posts</h2>
            <Link to="/recruiter/jobs" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
              Manage all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-sky-500 animate-spin" /></div>
          ) : jobs.length === 0 ? (
            <div className="card text-center py-10">
              <Briefcase className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-display">No jobs posted yet</p>
              <Link to="/recruiter/post-job" className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Post First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <div key={job._id} className="card glass-hover flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-white truncate">{job.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{job.location} · {job.type}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`badge text-xs ${job.status === 'active' ? 'badge-green' : 'badge-amber'}`}>{job.status}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Users className="w-3 h-3" /> {job.applicantCount}
                    </span>
                    <Link to={`/recruiter/jobs/${job._id}/applicants`} className="text-slate-600 hover:text-sky-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div>
          <h2 className="font-display text-xl font-semibold text-white mb-4">Recent Applications</h2>
          {recentApps.length === 0 ? (
            <div className="card text-center py-10">
              <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-display">No applications yet</p>
              <p className="text-slate-600 text-sm mt-1">Applications will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApps.map(({ app, job }) => {
                const u = app.userId as any;
                const statusCls: Record<string, string> = {
                  pending: 'badge-amber', reviewed: 'badge-blue',
                  shortlisted: 'badge-purple', accepted: 'badge-green', rejected: 'badge-red',
                };
                return (
                  <div key={app._id} className="card flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-surface-500 to-surface-600 border border-white/[0.08] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(app.profile?.full_name || u?.email || 'U')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{app.profile?.full_name || u?.email}</p>
                        <p className="text-xs text-slate-500 truncate">Applied to {job.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`${statusCls[app.status] || 'badge-blue'} text-xs`}>{app.status}</span>
                      <Link to={`/recruiter/jobs/${job._id}/applicants`} className="text-slate-600 hover:text-sky-400 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
