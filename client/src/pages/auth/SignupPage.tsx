import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Eye, EyeOff, Loader2, ArrowRight, Briefcase, User } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: '' as 'jobseeker' | 'recruiter' | '', // ✅ FIXED
  });

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.role) {
      toast('Please select a role', 'warning');
      return;
    }

    if (form.password.length < 6) {
      toast('Password must be at least 6 characters', 'warning');
      return;
    }

    console.log("DEBUG 👉", form); // ✅ optional debug

    setLoading(true);
    try {
      await signup(form.email, form.password, form.role, form.full_name);
      toast('Account created! Welcome to CareerAI 🎉', 'success');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 items-center justify-center mb-4 glow-blue">
            <span className="font-display text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 mt-2 text-sm">Join CareerAI — it's free</p>
        </div>

        <div className="card">

          {/* Role selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'jobseeker', label: 'Job Seeker', icon: User, desc: 'Looking for opportunities' }, // ✅ FIXED
                { value: 'recruiter', label: 'Recruiter', icon: Briefcase, desc: 'Hiring talent' },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value as any })}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    form.role === r.value
                      ? 'border-sky-500/50 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.15)]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <r.icon className={`w-5 h-5 mb-2 ${form.role === r.value ? 'text-sky-400' : 'text-slate-500'}`} />
                  <p className={`font-medium text-sm ${form.role === r.value ? 'text-white' : 'text-slate-300'}`}>
                    {r.label}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Full name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Your name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <p className="text-center text-slate-500 text-xs mt-4">
            By signing up you agree to our terms of service
          </p>

          <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}