import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Job } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { MapPin, Clock, DollarSign, Users, Briefcase, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await api.post('/applications/apply', { jobId: id, coverLetter });
      setApplied(true);
      setShowModal(false);
      toast('Application submitted! 🎉', 'success');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to apply', 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="pt-24 flex justify-center items-center min-h-screen">
      <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
    </div>
  );

  if (!job) return null;

  const salary = job.salary
    ? `$${(job.salary.min / 1000).toFixed(0)}k – $${(job.salary.max / 1000).toFixed(0)}k / yr`
    : 'Competitive';

  return (
    <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto animate-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-surface-500 to-surface-600 border border-white/[0.08] flex items-center justify-center text-white font-display font-bold text-2xl flex-shrink-0">
                {job.company[0]}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white">{job.title}</h1>
                <p className="text-sky-400 font-medium">{job.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {salary}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {job.applicantCount} applicants</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="badge-blue capitalize">{job.type}</span>
              <span className="badge-purple capitalize">{job.experienceLevel} level</span>
            </div>
          </div>

          <div className="card">
            <h2 className="font-display text-lg font-semibold text-white mb-4">About the Role</h2>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.requirements.length > 0 && (
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-white mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits.length > 0 && (
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-white mb-4">Benefits</h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b) => (
                  <span key={b} className="px-3 py-1.5 rounded-lg text-sm bg-green-500/10 text-green-400 border border-green-500/20">
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card sticky top-24">
            {applied ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="font-display font-semibold text-white">Applied!</p>
                <p className="text-slate-500 text-sm mt-1">Good luck with your application</p>
              </div>
            ) : user?.role === 'job_seeker' ? (
              <>
                <button onClick={() => setShowModal(true)} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  <Briefcase className="w-4 h-4" /> Apply Now
                </button>
                <p className="text-slate-600 text-xs text-center mt-3">Takes less than 2 minutes</p>
              </>
            ) : !user ? (
              <button onClick={() => navigate('/login')} className="btn-primary w-full py-3">
                Sign in to Apply
              </button>
            ) : (
              <p className="text-slate-500 text-sm text-center">Recruiters cannot apply to jobs</p>
            )}

            {job.skills.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <h3 className="font-display text-sm font-semibold text-white mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-md text-xs bg-white/[0.04] text-slate-400 border border-white/[0.06]">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-lg animate-in">
            <h2 className="font-display text-xl font-bold text-white mb-2">Apply to {job.title}</h2>
            <p className="text-slate-400 text-sm mb-5">{job.company} · {job.location}</p>

            <label className="block text-sm font-medium text-slate-400 mb-1.5">Cover Letter (optional)</label>
            <textarea
              className="input-field resize-none h-36"
              placeholder="Tell them why you're a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              <button onClick={handleApply} disabled={applying} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
                {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
