import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { Loader2, Plus, X, Sparkles } from 'lucide-react';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'];

export default function PostJob() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'full-time',
    experienceLevel: 'mid', description: '', salaryMin: '', salaryMax: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setNewSkill('');
  };

  const updateList = (list: string[], setList: (v: string[]) => void, idx: number, val: string) => {
    const next = [...list]; next[idx] = val; setList(next);
  };
  const addListItem = (list: string[], setList: (v: string[]) => void) => setList([...list, '']);
  const removeListItem = (list: string[], setList: (v: string[]) => void, idx: number) =>
    setList(list.filter((_, i) => i !== idx));

  const generateWithAI = async () => {
    if (!form.title || !form.company) {
      toast('Enter job title and company first', 'warning');
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
            content: `Generate a professional job posting for:
Title: ${form.title}
Company: ${form.company}
Type: ${form.type}
Level: ${form.experienceLevel}

Return ONLY valid JSON (no markdown):
{
  "description": "compelling 3-paragraph job description",
  "requirements": ["req1","req2","req3","req4","req5"],
  "skills": ["skill1","skill2","skill3","skill4","skill5"],
  "benefits": ["benefit1","benefit2","benefit3"]
}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setForm((f) => ({ ...f, description: parsed.description || f.description }));
      if (parsed.requirements?.length) setRequirements(parsed.requirements);
      if (parsed.skills?.length) setSkills(parsed.skills);
      if (parsed.benefits?.length) setBenefits(parsed.benefits);
      toast('AI content generated! ✨', 'success');
    } catch {
      toast('AI generation failed', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.description) {
      toast('Please fill in all required fields', 'warning');
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        ...form,
        skills,
        requirements: requirements.filter(Boolean),
        benefits: benefits.filter(Boolean),
      };
      if (form.salaryMin && form.salaryMax) {
        payload.salary = { min: Number(form.salaryMin), max: Number(form.salaryMax), currency: 'USD' };
      }
      delete payload.salaryMin; delete payload.salaryMax;
      await api.post('/jobs', payload);
      toast('Job posted successfully! 🎉', 'success');
      navigate('/recruiter/jobs');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to post job', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto animate-in">
      <div className="mb-8">
        <p className="text-slate-500 text-sm font-mono mb-1">— POST JOB</p>
        <h1 className="font-display text-3xl font-bold text-white">Create Job Listing</h1>
        <p className="text-slate-400 mt-1 text-sm">Fill in the details or use AI to generate content</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic details */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-white mb-5">Job Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Job Title *</label>
              <input type="text" className="input-field" placeholder="e.g. Senior Frontend Engineer" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Company *</label>
              <input type="text" className="input-field" placeholder="Company name" value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Location *</label>
              <input type="text" className="input-field" placeholder="e.g. San Francisco, CA" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Job Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {JOB_TYPES.map((t) => <option key={t} value={t} className="bg-surface-800 capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Experience Level</label>
              <select className="input-field" value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
                {LEVELS.map((l) => <option key={l} value={l} className="bg-surface-800 capitalize">{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Min Salary (USD/yr)</label>
              <input type="number" className="input-field" placeholder="e.g. 80000" value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Max Salary (USD/yr)</label>
              <input type="number" className="input-field" placeholder="e.g. 120000" value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">Description</h2>
            <button type="button" onClick={generateWithAI} disabled={aiLoading}
              className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors">
              {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Generate with AI
            </button>
          </div>
          <textarea className="input-field resize-none h-40" placeholder="Describe the role, team, and impact..." value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>

        {/* Requirements */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">Requirements</h2>
            <button type="button" onClick={() => addListItem(requirements, setRequirements)}
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {requirements.map((req, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" className="input-field flex-1" placeholder={`Requirement ${i + 1}`} value={req}
                  onChange={(e) => updateList(requirements, setRequirements, i, e.target.value)} />
                {requirements.length > 1 && (
                  <button type="button" onClick={() => removeListItem(requirements, setRequirements, i)}
                    className="text-slate-600 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-white mb-5">Required Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-sky-500/10 text-sky-300 border border-sky-500/20">
                {s}
                <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="text-sky-500 hover:text-sky-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" className="input-field flex-1" placeholder="Add a skill..." value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
            <button type="button" onClick={addSkill} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Benefits */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">Benefits</h2>
            <button type="button" onClick={() => addListItem(benefits, setBenefits)}
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" className="input-field flex-1" placeholder={`Benefit ${i + 1} (e.g. Health Insurance)`} value={b}
                  onChange={(e) => updateList(benefits, setBenefits, i, e.target.value)} />
                {benefits.length > 1 && (
                  <button type="button" onClick={() => removeListItem(benefits, setBenefits, i)}
                    className="text-slate-600 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/recruiter/jobs')} className="btn-secondary flex-1 py-3">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
}
