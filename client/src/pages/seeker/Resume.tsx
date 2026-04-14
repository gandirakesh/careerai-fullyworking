import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../lib/api';
import { Profile } from '../../types';
import {
  Download, Eye, Edit3, Save, Loader2, Sparkles, Plus, X,
  FileText, User, Briefcase, GraduationCap, Code2, Mail,
  Phone, MapPin, Globe, Linkedin, Github, ChevronDown, ChevronUp,
  CheckCircle2, RefreshCw
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ResumeData {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  bio: string;
  skills: string[];
  experience: {
    id: string;
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[];
}

// ─── Preview Component ────────────────────────────────────────────────────────

function ResumePreview({ data }: { data: ResumeData }) {
  return (
    <div
      id="resume-preview-content"
      className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: '1056px' }}
    >
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '40px 48px 32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '4px', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>
          {data.fullName || 'Your Name'}
        </h1>
        {data.headline && (
          <p style={{ fontSize: '15px', color: '#7dd3fc', marginBottom: '16px', fontFamily: 'DM Sans, sans-serif' }}>
            {data.headline}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontFamily: 'DM Sans, sans-serif' }}>
          {data.email && (
            <span style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>✉</span> {data.email}
            </span>
          )}
          {data.phone && (
            <span style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>☎</span> {data.phone}
            </span>
          )}
          {data.location && (
            <span style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>📍</span> {data.location}
            </span>
          )}
          {data.linkedin && (
            <span style={{ fontSize: '12px', color: '#7dd3fc' }}>{data.linkedin}</span>
          )}
          {data.github && (
            <span style={{ fontSize: '12px', color: '#7dd3fc' }}>{data.github}</span>
          )}
          {data.website && (
            <span style={{ fontSize: '12px', color: '#7dd3fc' }}>{data.website}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '36px 48px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '40px' }}>
        {/* Left column */}
        <div>
          {/* Summary */}
          {data.bio && (
            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#0ea5e9', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>
                Professional Summary
              </h2>
              <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #0ea5e9, #22d3ee)', marginBottom: '12px', borderRadius: '2px' }} />
              <p style={{ fontSize: '13px', lineHeight: '1.75', color: '#374151' }}>{data.bio}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#0ea5e9', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>
                Work Experience
              </h2>
              <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #0ea5e9, #22d3ee)', marginBottom: '16px', borderRadius: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>{exp.title}</h3>
                        <p style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: '600', fontFamily: 'DM Sans, sans-serif' }}>{exp.company}</p>
                      </div>
                      <span style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p style={{ fontSize: '12.5px', lineHeight: '1.7', color: '#4b5563', marginTop: '6px' }}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#0ea5e9', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>
                Education
              </h2>
              <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #0ea5e9, #22d3ee)', marginBottom: '16px', borderRadius: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>{edu.degree} in {edu.field}</h3>
                        <p style={{ fontSize: '13px', color: '#0ea5e9', fontFamily: 'DM Sans, sans-serif' }}>{edu.institution}</p>
                      </div>
                      <span style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
                        {edu.startDate} — {edu.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div>
          {/* Skills */}
          {data.skills.length > 0 && (
            <section style={{ marginBottom: '28px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#0ea5e9', marginBottom: '14px', fontFamily: 'DM Sans, sans-serif' }}>
                Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {data.skills.map((skill) => (
                  <span key={skill} style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                    background: '#e0f2fe', color: '#0369a1', fontFamily: 'DM Sans, sans-serif',
                    fontWeight: '500', border: '1px solid #bae6fd'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Contact details sidebar */}
          <section style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#0ea5e9', marginBottom: '14px', fontFamily: 'DM Sans, sans-serif' }}>
              Contact
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Email', val: data.email },
                { label: 'Phone', val: data.phone },
                { label: 'Location', val: data.location },
                { label: 'Website', val: data.website },
              ].filter(c => c.val).map(c => (
                <div key={c.label}>
                  <p style={{ fontSize: '10px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'DM Sans, sans-serif' }}>{c.label}</p>
                  <p style={{ fontSize: '12px', color: '#374151', fontFamily: 'DM Sans, sans-serif', wordBreak: 'break-all' }}>{c.val}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Editor Section ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, count }: { icon: any; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-sky-400" />
      </div>
      <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
      {count !== undefined && (
        <span className="ml-auto text-xs text-slate-600 font-mono">{count} items</span>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResumePage() {
  const { profile: authProfile, user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [expandedExp, setExpandedExp] = useState<string | null>(null);

  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
  });

  const [newSkill, setNewSkill] = useState('');

  // Hydrate from profile
  useEffect(() => {
    if (authProfile) {
      setResumeData({
        fullName: authProfile.full_name || '',
        headline: authProfile.headline || '',
        email: user?.email || '',
        phone: authProfile.phone || '',
        location: authProfile.location || '',
        website: authProfile.website || '',
        linkedin: authProfile.linkedin || '',
        github: authProfile.github || '',
        bio: authProfile.bio || '',
        skills: authProfile.skills || [],
        experience: (authProfile.experience || []).map((e, i) => ({
          id: e._id || `exp-${i}`,
          company: e.company,
          title: e.title,
          startDate: e.startDate ? e.startDate.slice(0, 7) : '',
          endDate: e.endDate ? e.endDate.slice(0, 7) : '',
          current: e.current || false,
          description: e.description || '',
        })),
        education: (authProfile.education || []).map((e, i) => ({
          id: e._id || `edu-${i}`,
          institution: e.institution,
          degree: e.degree,
          field: e.field,
          startDate: e.startDate ? e.startDate.slice(0, 7) : '',
          endDate: e.endDate ? e.endDate.slice(0, 7) : '',
        })),
      });
    }
  }, [authProfile, user]);

  const updateField = (key: keyof ResumeData, value: any) => {
    setResumeData(prev => ({ ...prev, [key]: value }));
  };

  // ── Experience CRUD ──
  const addExperience = () => {
    const id = `exp-${Date.now()}`;
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id, company: '', title: '', startDate: '', endDate: '', current: false, description: '' }],
    }));
    setExpandedExp(id);
  };

  const updateExp = (id: string, key: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [key]: value } : e),
    }));
  };

  const removeExp = (id: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  // ── Education CRUD ──
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: `edu-${Date.now()}`, institution: '', degree: '', field: '', startDate: '', endDate: '' }],
    }));
  };

  const updateEdu = (id: string, key: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [key]: value } : e),
    }));
  };

  const removeEdu = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  // ── Skills ──
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !resumeData.skills.includes(s)) {
      updateField('skills', [...resumeData.skills, s]);
    }
    setNewSkill('');
  };

  const removeSkill = (s: string) => {
    updateField('skills', resumeData.skills.filter(x => x !== s));
  };

  // ── Save to profile ──
  const save = async () => {
    setSaving(true);
    try {
      await api.put('/profiles/me', {
        full_name: resumeData.fullName,
        headline: resumeData.headline,
        phone: resumeData.phone,
        location: resumeData.location,
        website: resumeData.website,
        linkedin: resumeData.linkedin,
        github: resumeData.github,
        bio: resumeData.bio,
        skills: resumeData.skills,
        experience: resumeData.experience.map(e => ({
          _id: e.id.startsWith('exp-') ? undefined : e.id,
          company: e.company,
          title: e.title,
          startDate: e.startDate,
          endDate: e.current ? undefined : e.endDate,
          current: e.current,
          description: e.description,
        })),
        education: resumeData.education.map(e => ({
          _id: e.id.startsWith('edu-') ? undefined : e.id,
          institution: e.institution,
          degree: e.degree,
          field: e.field,
          startDate: e.startDate,
          endDate: e.endDate,
        })),
      });
      toast('Resume saved! ✓', 'success');
    } catch {
      toast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── AI Enhance ──
  const aiEnhance = async () => {
    if (!resumeData.bio && !resumeData.headline) {
      toast('Add a headline or bio first', 'warning');
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a professional resume writer. Given this resume data, improve the bio/summary to be compelling and ATS-optimized, and suggest 5 relevant skills to add.

Name: ${resumeData.fullName}
Headline: ${resumeData.headline}
Current Bio: ${resumeData.bio}
Skills: ${resumeData.skills.join(', ')}
Experience: ${resumeData.experience.map(e => `${e.title} at ${e.company}`).join(', ')}

Return ONLY valid JSON (no markdown): {"improvedBio": "...", "suggestedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"]}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      const newSkills = (parsed.suggestedSkills || []).filter((s: string) => !resumeData.skills.includes(s));
      setResumeData(prev => ({
        ...prev,
        bio: parsed.improvedBio || prev.bio,
        skills: [...prev.skills, ...newSkills.slice(0, 3)],
      }));
      toast('AI enhancement applied ✨', 'success');
    } catch {
      toast('AI enhancement failed', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // ── Download as HTML/Print ──
  const downloadResume = () => {
    setDownloading(true);
    try {
      const previewEl = document.getElementById('resume-preview-content');
      if (!previewEl) { toast('Switch to Preview tab first', 'warning'); setDownloading(false); return; }

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData.fullName || 'Resume'} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background: #fff; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
${previewEl.outerHTML}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.fullName || 'resume'}-resume.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast('Resume downloaded! Open in browser and print to PDF.', 'success');
    } catch {
      toast('Download failed', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // ── Print ──
  const printResume = () => {
    const previewEl = document.getElementById('resume-preview-content');
    if (!previewEl) { toast('Switch to Preview tab first', 'warning'); return; }
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${resumeData.fullName} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>${previewEl.outerHTML}</body>
</html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 800);
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto animate-in">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm font-mono mb-1">— RESUME BUILDER</p>
          <h1 className="font-display text-3xl font-bold text-white">
            My <span className="gradient-text">Resume</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Edit, preview and download your professional resume</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={aiEnhance}
            disabled={aiLoading}
            className="btn-secondary flex items-center gap-2 text-sm py-2"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
            AI Enhance
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="btn-primary flex items-center gap-2 text-sm py-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { id: 'edit', label: 'Edit', icon: Edit3 },
          { id: 'preview', label: 'Preview', icon: Eye },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'edit' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Main editor */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info */}
            <div className="card">
              <SectionHeader icon={User} title="Personal Information" />
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'fullName', placeholder: 'Jane Smith' },
                  { label: 'Professional Headline', key: 'headline', placeholder: 'Senior Software Engineer' },
                  { label: 'Email', key: 'email', placeholder: 'jane@email.com' },
                  { label: 'Phone', key: 'phone', placeholder: '+1 234 567 8900' },
                  { label: 'Location', key: 'location', placeholder: 'San Francisco, CA' },
                  { label: 'Website', key: 'website', placeholder: 'https://janesmith.dev' },
                  { label: 'LinkedIn', key: 'linkedin', placeholder: 'linkedin.com/in/janesmith' },
                  { label: 'GitHub', key: 'github', placeholder: 'github.com/janesmith' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'fullName' || f.key === 'headline' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{f.label}</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={f.placeholder}
                      value={(resumeData as any)[f.key] || ''}
                      onChange={e => updateField(f.key as any, e.target.value)}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-500">Professional Summary</label>
                    <button onClick={aiEnhance} disabled={aiLoading} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </div>
                  <textarea
                    className="input-field resize-none h-28"
                    placeholder="A compelling summary of your professional background and goals..."
                    value={resumeData.bio}
                    onChange={e => updateField('bio', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <SectionHeader icon={Briefcase} title="Work Experience" count={resumeData.experience.length} />
                <button onClick={addExperience} className="btn-secondary flex items-center gap-1.5 text-sm py-2 px-3">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {resumeData.experience.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                  <Briefcase className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">No experience added yet</p>
                  <button onClick={addExperience} className="text-sky-400 text-xs mt-2 hover:text-sky-300">+ Add your first role</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumeData.experience.map(exp => (
                    <div key={exp.id} className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{exp.title || 'New Role'}</p>
                          <p className="text-xs text-slate-500">{exp.company || 'Company'} · {exp.startDate || '—'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); removeExp(exp.id); }} className="p-1.5 text-slate-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                            <X className="w-3.5 h-3.5" />
                          </button>
                          {expandedExp === exp.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </div>
                      </div>
                      {expandedExp === exp.id && (
                        <div className="px-4 pb-4 border-t border-white/[0.06] pt-4 grid sm:grid-cols-2 gap-3">
                          {[
                            { label: 'Job Title', key: 'title', placeholder: 'Senior Developer', span: false },
                            { label: 'Company', key: 'company', placeholder: 'Acme Corp', span: false },
                            { label: 'Start Date', key: 'startDate', placeholder: '2022-01', span: false },
                            { label: 'End Date', key: 'endDate', placeholder: '2024-06', span: false },
                          ].map(f => (
                            <div key={f.key}>
                              <label className="block text-xs text-slate-500 mb-1.5">{f.label}</label>
                              <input
                                type="text"
                                className="input-field text-sm"
                                placeholder={f.placeholder}
                                value={(exp as any)[f.key] || ''}
                                onChange={e => updateExp(exp.id, f.key, e.target.value)}
                                disabled={f.key === 'endDate' && exp.current}
                              />
                            </div>
                          ))}
                          <div className="sm:col-span-2 flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`current-${exp.id}`}
                              checked={exp.current}
                              onChange={e => updateExp(exp.id, 'current', e.target.checked)}
                              className="w-4 h-4 rounded accent-sky-500"
                            />
                            <label htmlFor={`current-${exp.id}`} className="text-sm text-slate-400">Currently working here</label>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs text-slate-500 mb-1.5">Description</label>
                            <textarea
                              className="input-field resize-none h-24 text-sm"
                              placeholder="Key responsibilities and achievements..."
                              value={exp.description}
                              onChange={e => updateExp(exp.id, 'description', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <SectionHeader icon={GraduationCap} title="Education" count={resumeData.education.length} />
                <button onClick={addEducation} className="btn-secondary flex items-center gap-1.5 text-sm py-2 px-3">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {resumeData.education.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">No education added yet</p>
                  <button onClick={addEducation} className="text-sky-400 text-xs mt-2 hover:text-sky-300">+ Add education</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumeData.education.map(edu => (
                    <div key={edu.id} className="rounded-xl border border-white/[0.06] p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-white">{edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''}</p>
                          <p className="text-xs text-slate-500">{edu.institution || 'Institution'}</p>
                        </div>
                        <button onClick={() => removeEdu(edu.id)} className="p-1.5 text-slate-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { label: 'Institution', key: 'institution', placeholder: 'MIT' },
                          { label: 'Degree', key: 'degree', placeholder: 'Bachelor of Science' },
                          { label: 'Field of Study', key: 'field', placeholder: 'Computer Science' },
                          { label: 'Start Year', key: 'startDate', placeholder: '2018' },
                          { label: 'End Year', key: 'endDate', placeholder: '2022' },
                        ].map(f => (
                          <div key={f.key} className={f.key === 'institution' || f.key === 'degree' ? 'sm:col-span-2' : ''}>
                            <label className="block text-xs text-slate-500 mb-1.5">{f.label}</label>
                            <input
                              type="text"
                              className="input-field text-sm"
                              placeholder={f.placeholder}
                              value={(edu as any)[f.key] || ''}
                              onChange={e => updateEdu(edu.id, f.key, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Skills + Quick Tips */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="card">
              <SectionHeader icon={Code2} title="Skills" />
              <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                {resumeData.skills.length === 0 ? (
                  <p className="text-slate-600 text-xs">No skills added yet</p>
                ) : resumeData.skills.map(s => (
                  <span key={s} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    {s}
                    <button onClick={() => removeSkill(s)} className="text-sky-600 hover:text-sky-400 transition-colors ml-0.5">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input-field flex-1 text-sm"
                  placeholder="Add skill..."
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button onClick={addSkill} className="btn-secondary px-3">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Resume Tips */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="font-display text-lg font-semibold text-white">Resume Tips</h2>
              </div>
              <div className="space-y-3">
                {[
                  'Start bullet points with action verbs (Led, Built, Improved)',
                  'Quantify achievements with numbers and percentages',
                  'Tailor your skills to each job description',
                  'Keep summary under 4 sentences and results-focused',
                  'List skills in demand order for your target role',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={aiEnhance}
                disabled={aiLoading}
                className="w-full mt-4 btn-secondary flex items-center justify-center gap-2 text-sm py-2.5"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
                AI Improve My Resume
              </button>
            </div>

            {/* Download card */}
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(168,85,247,0.06))', borderColor: 'rgba(14,165,233,0.15)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Download className="w-4 h-4 text-sky-400" />
                </div>
                <h2 className="font-display text-lg font-semibold text-white">Export</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">Switch to Preview tab, then export or print your resume as a PDF.</p>
              <div className="space-y-2">
                <button
                  onClick={() => { setActiveTab('preview'); setTimeout(printResume, 300); }}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
                >
                  <Download className="w-4 h-4" />
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => { setActiveTab('preview'); setTimeout(downloadResume, 300); }}
                  disabled={downloading}
                  className="btn-secondary w-full flex items-center justify-center gap-2 text-sm py-2.5"
                >
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  Download as HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Preview Tab */
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">Live preview of your resume</p>
            <div className="flex items-center gap-2">
              <button onClick={printResume} className="btn-primary flex items-center gap-2 text-sm py-2">
                <Download className="w-4 h-4" /> Print / PDF
              </button>
              <button onClick={downloadResume} disabled={downloading} className="btn-secondary flex items-center gap-2 text-sm py-2">
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                HTML
              </button>
            </div>
          </div>
          <div className="max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 80px rgba(14,165,233,0.12)' }}>
            <ResumePreview data={resumeData} />
          </div>
        </div>
      )}
    </div>
  );
}
