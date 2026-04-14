import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { Job } from '../../types';
import { Briefcase, Plus, Loader2, Eye, Trash2, Users, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';

export default function RecruiterJobs() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    setLoading(true);
    api.get('/jobs/recruiter/mine')
      .then(({ data }) => setJobs(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const toggleStatus = async (job: Job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      await api.put(`/jobs/${job._id}`, { status: newStatus });
      setJobs((prev) => prev.map((j) => j._id === job._id ? { ...j, status: newStatus } : j));
      toast(`Job ${newStatus === 'active' ? 'activated' : 'closed'}`, 'success');
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job? This cannot be undone.')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast('Job deleted', 'success');
    } catch {
      toast('Failed to delete', 'error');
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-500 text-sm font-mono mb-1">— MY JOBS</p>
          <h1 className="font-display text-3xl font-bold text-white">Job Listings</h1>
          <p className="text-slate-400 mt-1 text-sm">{jobs.length} total · {jobs.filter((j) => j.status === 'active').length} active</p>
        </div>
        <Link to="/recruiter/post-job" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Post Job
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-7 h-7 text-sky-500 animate-spin" /></div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-16">
          <Briefcase className="w-14 h-14 text-slate-700 mx-auto mb-4" />
          <p className="font-display text-xl text-white mb-2">No jobs posted yet</p>
          <p className="text-slate-500 text-sm mb-6">Start attracting top talent by posting your first job</p>
          <Link to="/recruiter/post-job" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="card glass-hover">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display font-semibold text-white text-lg">{job.title}</h3>
                    <span className={`badge text-xs ${job.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span className="capitalize">{job.type}</span>
                    <span className="capitalize">{job.experienceLevel} level</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.applicantCount} applicants</span>
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleStatus(job)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      job.status === 'active'
                        ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400'
                        : 'bg-slate-500/10 text-slate-400 hover:bg-green-500/10 hover:text-green-400'
                    }`}
                  >
                    {job.status === 'active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {job.status === 'active' ? 'Active' : 'Closed'}
                  </button>
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Applicants
                  </Link>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Skills */}
              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/[0.05]">
                  {job.skills.slice(0, 6).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-xs bg-white/[0.03] text-slate-500 border border-white/[0.05]">{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
