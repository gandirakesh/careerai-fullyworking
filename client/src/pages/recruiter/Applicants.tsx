import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { Application, Job } from '../../types';
import { ArrowLeft, Loader2, Users, Zap, CheckCircle, XCircle, Eye, ChevronDown } from 'lucide-react';

const STATUSES = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];

const statusConfig: Record<string, { cls: string; label: string }> = {
  pending:     { cls: 'badge-amber',  label: 'Pending' },
  reviewed:    { cls: 'badge-blue',   label: 'Reviewed' },
  shortlisted: { cls: 'badge-purple', label: 'Shortlisted' },
  accepted:    { cls: 'badge-green',  label: 'Accepted' },
  rejected:    { cls: 'badge-red',    label: 'Rejected' },
};

export default function RecruiterApplicants() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    api.get(`/jobs/${id}/applications`)
      .then(({ data }) => { setJob(data.job); setApplications(data.applications); })
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (appId: string, status: string, recruiterNotes?: string) => {
    setUpdating(appId);
    try {
      await api.put(`/applications/${appId}/status`, { status, recruiterNotes });
      setApplications((prev) => prev.map((a) => a._id === appId ? { ...a, status: status as any, recruiterNotes: recruiterNotes || a.recruiterNotes } : a));
      if (selectedApp?._id === appId) setSelectedApp((prev) => prev ? { ...prev, status: status as any } : null);
      toast(`Status updated to ${status}`, 'success');
    } catch {
      toast('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const quickAction = (appId: string, status: 'accepted' | 'rejected') => updateStatus(appId, status);

  const filtered = filterStatus ? applications.filter((a) => a.status === filterStatus) : applications;

  return (
    <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto animate-in">
      <Link to="/recruiter/jobs" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-7 h-7 text-sky-500 animate-spin" /></div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm font-mono mb-1">— APPLICANTS</p>
            <h1 className="font-display text-3xl font-bold text-white">{job?.title}</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {job?.company} · {job?.location} · {applications.length} applicants
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['', ...STATUSES].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  filterStatus === s
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : 'text-slate-500 hover:text-white border border-transparent hover:bg-white/5'
                }`}>
                {s ? statusConfig[s].label : 'All'} ({s ? applications.filter((a) => a.status === s).length : applications.length})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card text-center py-16">
              <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="font-display text-xl text-white mb-1">No applicants yet</p>
              <p className="text-slate-500 text-sm">Applications will appear here as candidates apply</p>
            </div>
          ) : (
            <div className={`grid ${selectedApp ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
              {/* Applicant list */}
              <div className="space-y-3">
                {filtered.map((app) => {
                  const profile = app.profile;
                  const user = app.userId as any;
                  const name = profile?.full_name || user?.email || 'Applicant';
                  const { cls, label } = statusConfig[app.status] || statusConfig.pending;

                  return (
                    <div
                      key={app._id}
                      className={`card cursor-pointer transition-all duration-200 ${
                        selectedApp?._id === app._id
                          ? 'border-sky-500/40 bg-sky-500/5'
                          : 'glass-hover'
                      }`}
                      onClick={() => { setSelectedApp(app); setNote(app.recruiterNotes || ''); }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {name[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-semibold text-white">{name}</p>
                            <p className="text-xs text-slate-500 truncate">{profile?.headline || user?.email}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className={`${cls} text-xs`}>{label}</span>
                              {app.matchScore > 0 && (
                                <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                                  <Zap className="w-3 h-3 text-sky-400" /> {app.matchScore}% match
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          {app.status !== 'accepted' && (
                            <button
                              onClick={() => quickAction(app._id, 'accepted')}
                              disabled={!!updating}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                              title="Accept"
                            >
                              {updating === app._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button
                              onClick={() => quickAction(app._id, 'rejected')}
                              disabled={!!updating}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                              title="Reject"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all" title="View details">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Skills preview */}
                      {profile?.skills && profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.05]">
                          {profile.skills.slice(0, 4).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded text-xs bg-white/[0.03] text-slate-500 border border-white/[0.05]">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detail panel */}
              {selectedApp && (
                <div className="space-y-4">
                  <div className="card sticky top-24">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="font-display text-xl font-bold text-white">
                          {selectedApp.profile?.full_name || (selectedApp.userId as any)?.email}
                        </h3>
                        <p className="text-slate-400 text-sm">{selectedApp.profile?.headline}</p>
                      </div>
                      <button onClick={() => setSelectedApp(null)} className="text-slate-600 hover:text-white transition-colors text-xs">✕ Close</button>
                    </div>

                    {/* Profile details */}
                    {selectedApp.profile && (
                      <div className="space-y-4 mb-5">
                        {selectedApp.profile.location && (
                          <p className="text-sm text-slate-400">📍 {selectedApp.profile.location}</p>
                        )}
                        {selectedApp.profile.bio && (
                          <p className="text-sm text-slate-400 leading-relaxed">{selectedApp.profile.bio}</p>
                        )}
                        {selectedApp.profile.skills.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-500 mb-2 font-medium">Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedApp.profile.skills.map((s) => (
                                <span key={s} className="px-2.5 py-1 rounded-lg text-xs bg-sky-500/10 text-sky-300 border border-sky-500/20">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cover letter */}
                    {selectedApp.coverLetter && (
                      <div className="mb-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-xs text-slate-500 mb-2 font-medium">Cover Letter</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{selectedApp.coverLetter}</p>
                      </div>
                    )}

                    {/* Resume link */}
                    {selectedApp.profile?.resumeUrl && (
                      <a href={selectedApp.profile.resumeUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 mb-5">
                        📄 View Resume
                      </a>
                    )}

                    {/* Status change */}
                    <div className="mb-4">
                      <label className="block text-xs text-slate-500 mb-2 font-medium">Update Status</label>
                      <div className="relative">
                        <select
                          className="input-field appearance-none pr-8 cursor-pointer"
                          value={selectedApp.status}
                          onChange={(e) => updateStatus(selectedApp._id, e.target.value, note)}
                          disabled={!!updating}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-surface-800 capitalize">{statusConfig[s].label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-xs text-slate-500 mb-2 font-medium">Recruiter Note</label>
                      <textarea
                        className="input-field resize-none h-20 text-sm"
                        placeholder="Add a note visible to the applicant..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <button
                        onClick={() => updateStatus(selectedApp._id, selectedApp.status, note)}
                        disabled={!!updating}
                        className="btn-primary w-full mt-2 py-2.5 flex items-center justify-center gap-2"
                      >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
