import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Application, Job } from '../../types';
import { FileText, Loader2, Zap, ExternalLink } from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:     { label: 'Pending',     cls: 'badge-amber' },
  reviewed:    { label: 'Reviewed',    cls: 'badge-blue' },
  shortlisted: { label: 'Shortlisted', cls: 'badge-purple' },
  accepted:    { label: 'Accepted',    cls: 'badge-green' },
  rejected:    { label: 'Rejected',    cls: 'badge-red' },
};

export default function SeekerApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/applications')
      .then(({ data }) => setApps(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? apps.filter((a) => a.status === filter) : apps;

  return (
    <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto animate-in">
      <div className="mb-8">
        <p className="text-slate-500 text-sm font-mono mb-1">— APPLICATIONS</p>
        <h1 className="font-display text-3xl font-bold text-white">My Applications</h1>
        <p className="text-slate-400 mt-1 text-sm">{apps.length} total applications</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              filter === s
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {s ? STATUS_LABELS[s].label : 'All'} {s ? `(${apps.filter((a) => a.status === s).length})` : `(${apps.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 text-sky-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-display text-lg">No applications yet</p>
          <p className="text-slate-600 text-sm mt-1 mb-6">Start applying to jobs to see them here</p>
          <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const job = app.jobId as Job;
            const { cls, label } = STATUS_LABELS[app.status] || { cls: 'badge-blue', label: app.status };
            return (
              <div key={app._id} className="card glass-hover">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-surface-500 to-surface-600 border border-white/[0.08] flex items-center justify-center text-white font-display font-bold flex-shrink-0">
                      {typeof job === 'object' ? job.company?.[0] : '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-white">
                          {typeof job === 'object' ? job.title : 'Job'}
                        </h3>
                        {typeof job === 'object' && (
                          <Link to={`/jobs/${job._id}`} className="text-slate-600 hover:text-sky-400 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm">
                        {typeof job === 'object' ? job.company : ''} · {typeof job === 'object' ? job.location : ''}
                      </p>
                      <p className="text-slate-600 text-xs mt-1">
                        Applied {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={cls}>{label}</span>
                    {app.matchScore > 0 && (
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                        <Zap className="w-3 h-3" /> {app.matchScore}% match
                      </span>
                    )}
                  </div>
                </div>

                {app.recruiterNotes && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <p className="text-xs text-slate-500 mb-1">Recruiter note:</p>
                    <p className="text-sm text-slate-400 italic">"{app.recruiterNotes}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
