import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, TrendingUp, Briefcase, Users, Star } from 'lucide-react';

const STATS = [
  { label: 'Active Jobs', value: '12,400+' },
  { label: 'Companies Hiring', value: '3,200+' },
  { label: 'Placements Made', value: '89,000+' },
  { label: 'Match Accuracy', value: '94%' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'AI-Powered Matching',
    desc: 'Our algorithm analyzes your skills, experience and preferences to surface the most relevant opportunities.',
    color: 'from-sky-500 to-cyan-400',
  },
  {
    icon: Shield,
    title: 'Verified Employers',
    desc: 'Every company on CareerAI is verified. No fake listings, no ghosting — real opportunities only.',
    color: 'from-purple-500 to-violet-400',
  },
  {
    icon: TrendingUp,
    title: 'Career Analytics',
    desc: 'Track your application pipeline, see market trends, and benchmark your skills against the market.',
    color: 'from-emerald-500 to-teal-400',
  },
];

export default function LandingPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/8 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge-blue mb-8 py-2 px-4">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">AI-Powered Career Platform</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6 text-balance">
            Land Your{' '}
            <span className="gradient-text">Dream Role</span>
            {' '}Faster
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            CareerAI connects ambitious professionals with top companies using intelligent matching, 
            real-time insights, and a streamlined hiring pipeline.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 w-full sm:w-auto justify-center">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/jobs" className="btn-secondary text-base px-8 py-3.5 flex items-center gap-2 w-full sm:w-auto justify-center">
              <Briefcase className="w-4 h-4" /> Browse Jobs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20">
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4">
                <p className="font-display text-2xl sm:text-3xl font-bold gradient-text">{s.value}</p>
                <p className="text-slate-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-400 text-sm font-medium font-mono mb-3">— WHY CAREERAI</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
              Built for how hiring <span className="gradient-text">actually works</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card glass-hover group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Recruiters */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-3xl p-8 sm:p-12 border border-sky-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-purple-500/5 pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-sky-400 text-sm font-mono mb-3">— FOR RECRUITERS</p>
                <h2 className="font-display text-4xl font-bold text-white mb-4">
                  Hire smarter, <span className="gradient-text">not harder</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Post jobs, manage applications, and find the right candidates — all in one streamlined dashboard. 
                  Our AI match scoring surfaces your best applicants instantly.
                </p>
                <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
                  Start Hiring <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: 'Applicant Tracking', desc: 'Manage your pipeline' },
                  { icon: Zap, label: 'AI Match Score', desc: 'Rank candidates instantly' },
                  { icon: Star, label: 'Company Branding', desc: 'Attract top talent' },
                  { icon: TrendingUp, label: 'Hiring Analytics', desc: 'Data-driven decisions' },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <item.icon className="w-5 h-5 text-sky-400 mb-2" />
                    <p className="font-display text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Ready to find your <span className="gradient-text">next opportunity?</span>
          </h2>
          <p className="text-slate-400 mb-8">Join thousands of professionals who found their dream role on CareerAI.</p>
          <Link to="/signup" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
              <span className="font-display text-white text-xs font-bold">C</span>
            </div>
            <span className="font-display font-bold text-white">CareerAI</span>
          </div>
          <p className="text-slate-600 text-sm">© 2025 CareerAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
