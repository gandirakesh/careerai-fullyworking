import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { Job, Application } from '../../types';
import JobCard from '../../components/jobs/JobCard';
import { Briefcase, FileText, TrendingUp, Zap, ArrowRight, Loader2, Edit3 } from 'lucide-react';

export default function SeekerDashboard() {
  const { user, profile } = useAuth();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/jobs', { params: { limit: 6 } }),
      api.get('/applications'),
    ]).then(([jobsRes, appsRes]) => {
      setRecentJobs(jobsRes.data.jobs);
      setApplications(appsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const appliedJobIds = new Set(applications.map((a) => typeof a.jobId === 'object' ? (a.jobId as Job)._id : a.jobId));
  const pending = applications.filter((a) => a.status === 'pending').length;
  const accepted = applications.filter((a) => a.status === 'accepted').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto animate-in">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm font-mono mb-1">— DASHBOARD</p>
          <h1 className="font-display text-3xl font-bold text-white">
            {greeting()}, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Your career command center</p>
        </div>
        <Link to="/jobs" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Zap className="w-4 h-4" /> Find Jobs
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Applied', value: applications.length, icon: FileText, color: 'text-sky-400' },
          { label: 'Pending Review', value: pending, icon: TrendingUp, color: 'text-amber-400' },
          { label: 'Accepted', value: accepted, icon: Briefcase, color: 'text-green-400' },
          { label: 'Skills Listed', value: profile?.skills?.length || 0, icon: Zap, color: 'text-purple-400' },
        ].map((s) => (
          <div key={s.label} className="card">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="font-display text-2xl font-bold text-white">{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Resume quick access */}
      <div className="glass rounded-2xl p-5 mb-8 border border-sky-500/10 bg-sky-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p className="font-display font-semibold text-white">Resume Builder</p>
            <p className="text-slate-400 text-sm mt-0.5">Edit, preview and download your professional resume</p>
          </div>
        </div>
        <Link to="/resume" className="btn-primary text-sm py-2 flex items-center gap-2 flex-shrink-0">
          <Edit3 className="w-4 h-4" /> Open Resume
        </Link>
      </div>

      {/* Profile completion */}
      {profile && profile.skills.length === 0 && (
        <div className="glass rounded-2xl p-5 mb-8 border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-display font-semibold text-white">Complete your profile</p>
            <p className="text-slate-400 text-sm mt-0.5">Add skills and experience to get better job matches</p>
          </div>
          <Link to="/profile" className="btn-primary text-sm py-2 flex items-center gap-2 flex-shrink-0">
            Complete Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Recent jobs */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-white">Latest Opportunities</h2>
          <Link to="/jobs" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-sky-500 animate-spin" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job} applied={appliedJobIds.has(job._id)} />
            ))}
          </div>
        )}
      </div>

      {/* Recent applications */}
      {applications.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-semibold text-white">Recent Applications</h2>
            <Link to="/applications" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => {
              const job = app.jobId as Job;
              const statusColors: Record<string, string> = {
                pending: 'badge-amber',
                reviewed: 'badge-blue',
                shortlisted: 'badge-purple',
                accepted: 'badge-green',
                rejected: 'badge-red',
              };
              return (
                <div key={app._id} className="card flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{typeof job === 'object' ? job.title : 'Job'}</p>
                    <p className="text-slate-500 text-sm">{typeof job === 'object' ? job.company : ''} · {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {app.matchScore > 0 && (
                      <span className="text-xs font-mono text-slate-500">{app.matchScore}% match</span>
                    )}
                    <span className={statusColors[app.status] || 'badge-blue'}>{app.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
