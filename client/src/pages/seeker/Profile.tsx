import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../lib/api';
import { Profile } from '../../types';
import { Save, Plus, X, Upload, Loader2, Sparkles } from 'lucide-react';

export default function SeekerProfile() {
  const { profile: authProfile, refreshUser } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<Profile>>({
    full_name: '', headline: '', bio: '', location: '',
    phone: '', website: '', linkedin: '', github: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (authProfile) setForm(authProfile);
  }, [authProfile]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/profiles/me', form);
      await refreshUser();
      toast('Profile updated!', 'success');
    } catch {
      toast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !form.skills?.includes(s)) {
      setForm({ ...form, skills: [...(form.skills || []), s] });
    }
    setNewSkill('');
  };

  const removeSkill = (s: string) => setForm({ ...form, skills: form.skills?.filter((x) => x !== s) });

  const uploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const { data } = await api.post('/profiles/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, resumeUrl: data.resumeUrl });
      toast('Resume uploaded!', 'success');
    } catch {
      toast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const getAiSuggestions = async () => {
    if (!form.headline && !form.bio) {
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
            content: `Given this professional profile:
Headline: ${form.headline}
Bio: ${form.bio}
Skills: ${form.skills?.join(', ')}

Suggest 5 additional skills they should add based on their profile, and improve their bio to be more compelling. Return JSON only: {"suggestedSkills": [...], "improvedBio": "..."}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.suggestedSkills) {
        const existing = form.skills || [];
        const newSkills = parsed.suggestedSkills.filter((s: string) => !existing.includes(s));
        setForm((f) => ({
          ...f,
          skills: [...existing, ...newSkills.slice(0, 3)],
          bio: parsed.improvedBio || f.bio,
        }));
        toast('AI suggestions applied! ✨', 'success');
      }
    } catch {
      toast('AI suggestion failed', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-500 text-sm font-mono mb-1">— PROFILE</p>
          <h1 className="font-display text-3xl font-bold text-white">My Profile</h1>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-white mb-5">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', key: 'full_name', placeholder: 'Your full name' },
              { label: 'Headline', key: 'headline', placeholder: 'e.g. Senior React Developer' },
              { label: 'Location', key: 'location', placeholder: 'City, Country' },
              { label: 'Phone', key: 'phone', placeholder: '+1 234 567 8900' },
              { label: 'Website', key: 'website', placeholder: 'https://yoursite.com' },
              { label: 'LinkedIn', key: 'linkedin', placeholder: 'linkedin.com/in/yourprofile' },
              { label: 'GitHub', key: 'github', placeholder: 'github.com/yourhandle' },
            ].map((f) => (
              <div key={f.key} className={f.key === 'full_name' || f.key === 'headline' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">{f.label}</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={f.placeholder}
                  value={(form as any)[f.key] || ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-500">Bio</label>
                <button onClick={getAiSuggestions} disabled={aiLoading} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI Enhance
                </button>
              </div>
              <textarea
                className="input-field resize-none h-28"
                placeholder="Tell recruiters about yourself..."
                value={form.bio || ''}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">Skills</h2>
            <span className="text-slate-600 text-xs">{form.skills?.length || 0} added</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {form.skills?.map((s) => (
              <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-sky-500/10 text-sky-300 border border-sky-500/20">
                {s}
                <button onClick={() => removeSkill(s)} className="text-sky-500 hover:text-sky-300 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(!form.skills || form.skills.length === 0) && (
              <p className="text-slate-600 text-sm">No skills added yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Add a skill (e.g. React, Python...)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button onClick={addSkill} className="btn-secondary px-3">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-white mb-5">Resume</h2>
          {form.resumeUrl ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
              <span className="text-green-400 text-sm">✓ Resume uploaded</span>
              <a href={form.resumeUrl} target="_blank" rel="noreferrer" className="text-sky-400 text-xs hover:text-sky-300">View</a>
            </div>
          ) : null}
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={uploadResume} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-secondary flex items-center gap-2 w-full justify-center py-3">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {form.resumeUrl ? 'Replace Resume' : 'Upload Resume'} (PDF, DOC — max 5MB)
          </button>
        </div>
      </div>
    </div>
  );
}
