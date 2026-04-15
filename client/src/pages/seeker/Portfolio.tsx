import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../lib/api';
import { PortfolioProject } from '../../types';
import {
  Plus, X, Save, Loader2, Sparkles, ExternalLink, Github,
  Star, StarOff, Eye, Edit3, Globe, Code2, Tag, Calendar,
  Layers, ArrowUpRight, Trash2, GripVertical, CheckCircle2,
  Copy, Share2
} from 'lucide-react';

// ─── Colour palette for project cards ────────────────────────────────────────
const CARD_GRADIENTS = [
  'from-sky-500/20 to-cyan-500/10',
  'from-purple-500/20 to-pink-500/10',
  'from-emerald-500/20 to-teal-500/10',
  'from-amber-500/20 to-orange-500/10',
  'from-rose-500/20 to-red-500/10',
  'from-indigo-500/20 to-violet-500/10',
];

const BORDER_COLORS = [
  'border-sky-500/20',
  'border-purple-500/20',
  'border-emerald-500/20',
  'border-amber-500/20',
  'border-rose-500/20',
  'border-indigo-500/20',
];

const ACCENT_COLORS = [
  'text-sky-400',
  'text-purple-400',
  'text-emerald-400',
  'text-amber-400',
  'text-rose-400',
  'text-indigo-400',
];

// ─── Project Card (Preview mode) ─────────────────────────────────────────────
function ProjectCard({
  project, index, onEdit, onDelete, onToggleFeatured,
}: {
  project: PortfolioProject & { id: string };
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
}) {
  const grad = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const border = BORDER_COLORS[index % BORDER_COLORS.length];
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <div className={`relative rounded-2xl border ${border} bg-gradient-to-br ${grad} overflow-hidden group transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl`}
      style={{ backdropFilter: 'blur(12px)' }}>
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
          style={{ background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.3)', color: '#fbbf24' }}>
          <Star className="w-2.5 h-2.5 fill-current" /> Featured
        </div>
      )}

      {/* Actions */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onToggleFeatured}
          className="p-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
          title={project.featured ? 'Unfeature' : 'Feature'}>
          {project.featured
            ? <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            : <StarOff className="w-3.5 h-3.5 text-slate-400" />}
        </button>
        <button onClick={onEdit}
          className="p-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <Edit3 className="w-3.5 h-3.5 text-slate-300" />
        </button>
        <button onClick={onDelete}
          className="p-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>

      {/* Visual top bar */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }}>
        <div className={`h-full w-full ${accent.replace('text-', 'bg-').replace('-400', '-500')} opacity-60`} />
      </div>

      <div className="p-6">
        {/* Year */}
        {project.year && (
          <p className="text-xs font-mono text-slate-600 mb-2">{project.year}</p>
        )}

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-white mb-2 leading-tight">
          {project.title || 'Untitled Project'}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {project.description || 'No description added yet.'}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 4).map(tag => (
              <span key={tag}
                className="text-xs px-2 py-0.5 rounded-md font-mono"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-xs text-slate-600 self-center">+{project.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer"
              className={`flex items-center gap-1.5 text-xs font-medium ${accent} hover:opacity-80 transition-opacity`}>
              <Globe className="w-3.5 h-3.5" /> Live Demo <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
          {project.liveUrl && project.repoUrl && (
            <span className="text-slate-700 text-xs">·</span>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">
              <Github className="w-3.5 h-3.5" /> Source <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
          {!project.liveUrl && !project.repoUrl && (
            <span className="text-xs text-slate-700 italic">No links added</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Project Editor Modal ─────────────────────────────────────────────────────
function ProjectEditor({
  project,
  onSave,
  onClose,
}: {
  project: PortfolioProject & { id: string };
  onSave: (p: PortfolioProject & { id: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...project });
  const [newTag, setNewTag] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  const update = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const addTag = () => {
    const t = newTag.trim();
    if (t && !form.tags.includes(t)) update('tags', [...form.tags, t]);
    setNewTag('');
  };

  const aiDescribe = async () => {
    if (!form.title) { toast('Add a project title first', 'warning'); return; }
    setAiLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          messages: [{
            role: 'user',
            content: `Write a compelling 2-3 sentence portfolio description for a project called "${form.title}".
Tags/tech: ${form.tags.join(', ') || 'not specified'}.
Current description: ${form.description || 'none'}.
Make it sound impressive for recruiters. Return ONLY the description text, no quotes or extra formatting.`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text?.trim();
      if (text) { update('description', text); toast('AI description generated ✨', 'success'); }
    } catch {
      toast('AI failed', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <h2 className="font-display font-semibold text-white">
            {project.title ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Project Title *</label>
            <input className="input-field" placeholder="My Awesome App" value={form.title}
              onChange={e => update('title', e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-500">Description</label>
              <button onClick={aiDescribe} disabled={aiLoading}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI Write
              </button>
            </div>
            <textarea className="input-field resize-none h-24"
              placeholder="Describe what the project does, the problem it solves, your role..."
              value={form.description}
              onChange={e => update('description', e.target.value)} />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Live URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                <input className="input-field pl-8 text-sm" placeholder="https://myapp.com"
                  value={form.liveUrl || ''} onChange={e => update('liveUrl', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Repo URL</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                <input className="input-field pl-8 text-sm" placeholder="https://github.com/..."
                  value={form.repoUrl || ''} onChange={e => update('repoUrl', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Year</label>
            <input className="input-field text-sm" placeholder="2024"
              value={form.year || ''} onChange={e => update('year', e.target.value)} />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Tech Stack / Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(t => (
                <span key={t} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  {t}
                  <button onClick={() => update('tags', form.tags.filter(x => x !== t))}
                    className="text-sky-600 hover:text-sky-300 transition-colors">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input-field flex-1 text-sm" placeholder="React, Node.js, Tailwind..."
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
              <button onClick={addTag} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? 'bg-amber-500' : 'bg-slate-700'}`}
              onClick={() => update('featured', !form.featured)}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-slate-300">Mark as Featured project</span>
            <Star className={`w-4 h-4 ${form.featured ? 'text-amber-400 fill-current' : 'text-slate-600'}`} />
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button onClick={onClose} className="btn-secondary text-sm py-2">Cancel</button>
          <button onClick={() => onSave(form)} className="btn-primary flex items-center gap-2 text-sm py-2">
            <Save className="w-4 h-4" /> Save Project
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio Preview (public view simulation) ───────────────────────────────
function PortfolioPreview({ projects, name, headline, github, website }: {
  projects: (PortfolioProject & { id: string })[];
  name: string;
  headline: string;
  github?: string;
  website?: string;
}) {
  const featured = projects.filter(p => p.featured);
  const rest = projects.filter(p => !p.featured);

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#080b14', border: '1px solid rgba(255,255,255,0.06)', minHeight: 600 }}>
      {/* Hero */}
      <div className="relative px-8 py-12 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(168,85,247,0.08) 100%)' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(14,165,233,0.15) 0%, transparent 70%)'
        }} />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white font-display"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #a855f7)' }}>
            {name ? name[0].toUpperCase() : '?'}
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">{name || 'Your Name'}</h1>
          <p className="text-slate-400 text-sm mb-4">{headline || 'Developer & Creator'}</p>
          <div className="flex items-center justify-center gap-3">
            {website && (
              <a href={website} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300">
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
            {github && (
              <a href={`https://${github}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="w-12 h-12 text-slate-800 mx-auto mb-3" />
            <p className="text-slate-600">No projects yet — add some in the Editor tab!</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <h2 className="font-display text-sm font-semibold text-white uppercase tracking-widest">Featured Work</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {featured.map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i}
                      onEdit={() => {}} onDelete={() => {}} onToggleFeatured={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* All projects */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="font-display text-sm font-semibold text-white uppercase tracking-widest mb-5">More Projects</h2>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i + featured.length}
                      onEdit={() => {}} onDelete={() => {}} onToggleFeatured={() => {}} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const { profile: authProfile, user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<(PortfolioProject & { id: string }) | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  type LocalProject = PortfolioProject & { id: string };

  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [profileInfo, setProfileInfo] = useState({ name: '', headline: '', github: '', website: '' });

  // Hydrate
  useEffect(() => {
    if (authProfile) {
      setProfileInfo({
        name: authProfile.full_name || '',
        headline: authProfile.headline || '',
        github: authProfile.github || '',
        website: authProfile.website || '',
      });
      setProjects(
        (authProfile.portfolio || []).map((p, i) => ({
          ...p,
          id: p._id || `proj-${i}`,
          tags: p.tags || [],
          featured: p.featured || false,
        }))
      );
    }
  }, [authProfile]);

  const openNewProject = () => {
    setEditingProject({ id: `proj-${Date.now()}`, title: '', description: '', liveUrl: '', repoUrl: '', tags: [], featured: false, year: String(new Date().getFullYear()) });
  };

  const saveProject = (updated: LocalProject) => {
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === updated.id);
      if (idx >= 0) { const arr = [...prev]; arr[idx] = updated; return arr; }
      return [...prev, updated];
    });
    setEditingProject(null);
    toast('Project saved', 'success');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast('Project removed', 'success');
  };

  const toggleFeatured = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  // Save to backend
  const save = async () => {
    setSaving(true);
    try {
      await api.put('/profiles/me', {
        portfolio: projects.map(p => ({
          _id: p.id.startsWith('proj-') ? undefined : p.id,
          title: p.title,
          description: p.description,
          liveUrl: p.liveUrl,
          repoUrl: p.repoUrl,
          tags: p.tags,
          featured: p.featured,
          image: p.image,
          year: p.year,
        })),
      });
      toast('Portfolio saved! ✓', 'success');
    } catch {
      toast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  // AI generate project ideas
  const aiSuggestProjects = async () => {
    if (!authProfile?.skills?.length) { toast('Add skills to your profile first', 'warning'); return; }
    setAiLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 800,
          messages: [{
            role: 'user',
            content: `Suggest 3 impressive portfolio project ideas for a developer with these skills: ${authProfile.skills.join(', ')}.
Headline: ${authProfile.headline || 'developer'}.

Return ONLY valid JSON array (no markdown):
[{"title":"...","description":"2 sentences","tags":["tag1","tag2","tag3"],"year":"2024"}]`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      const parsed: any[] = JSON.parse(text.replace(/```json|```/g, '').trim());
      const newProjects: LocalProject[] = parsed.map((p, i) => ({
        id: `proj-ai-${Date.now()}-${i}`,
        title: p.title,
        description: p.description,
        tags: p.tags || [],
        featured: false,
        liveUrl: '',
        repoUrl: '',
        year: p.year || String(new Date().getFullYear()),
      }));
      setProjects(prev => [...prev, ...newProjects]);
      toast(`${newProjects.length} project ideas added ✨`, 'success');
    } catch {
      toast('AI suggestion failed', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Portfolio link copied!', 'success');
  };

  const displayed = filter === 'featured' ? projects.filter(p => p.featured) : projects;
  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto animate-in">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm font-mono mb-1">— PORTFOLIO</p>
          <h1 className="font-display text-3xl font-bold text-white">
            My <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Showcase your projects to recruiters</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={copyShareLink} className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={aiSuggestProjects} disabled={aiLoading} className="btn-secondary flex items-center gap-2 text-sm py-2">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
            AI Suggest
          </button>
          <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 text-sm py-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Projects', value: projects.length, icon: Layers, color: 'text-sky-400' },
          { label: 'Featured', value: featuredCount, icon: Star, color: 'text-amber-400' },
          { label: 'With Live Demo', value: projects.filter(p => p.liveUrl).length, icon: Globe, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3 py-4">
            <s.icon className={`w-5 h-5 ${s.color} flex-shrink-0`} />
            <div>
              <p className="font-display text-xl font-bold text-white">{s.value}</p>
              <p className="text-slate-500 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { id: 'edit', label: 'Editor', icon: Edit3 },
            { id: 'preview', label: 'Preview', icon: Eye },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'edit' && (
          <div className="flex items-center gap-2">
            {/* Filter pills */}
            {['all', 'featured'].map(f => (
              <button key={f} onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {f === 'all' ? `All (${projects.length})` : `Featured (${featuredCount})`}
              </button>
            ))}
            <button onClick={openNewProject} className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'edit' ? (
        <div>
          {displayed.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>
                <Layers className="w-7 h-7 text-sky-500/50" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-500 mb-2">
                {filter === 'featured' ? 'No featured projects yet' : 'No projects yet'}
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                {filter === 'featured'
                  ? 'Star a project to feature it on your portfolio'
                  : 'Add your first project or let AI suggest some ideas'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={openNewProject} className="btn-primary flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
                <button onClick={aiSuggestProjects} disabled={aiLoading} className="btn-secondary flex items-center gap-2 text-sm">
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
                  AI Suggest Ideas
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayed.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    index={i}
                    onEdit={() => setEditingProject(p)}
                    onDelete={() => deleteProject(p.id)}
                    onToggleFeatured={() => toggleFeatured(p.id)}
                  />
                ))}

                {/* Add more card */}
                <button onClick={openNewProject}
                  className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-12 transition-all hover:border-sky-500/30 hover:bg-sky-500/5 group"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(14,165,233,0.08)' }}>
                    <Plus className="w-5 h-5 text-sky-500/50 group-hover:text-sky-400 transition-colors" />
                  </div>
                  <p className="text-sm text-slate-600 group-hover:text-slate-400 transition-colors">Add Project</p>
                </button>
              </div>

              {/* Tips */}
              <div className="mt-8 card" style={{ background: 'rgba(168,85,247,0.04)', borderColor: 'rgba(168,85,247,0.12)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="font-display font-semibold text-white text-sm">Portfolio Tips</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    'Feature your 2-3 best projects at the top',
                    'Always include a live demo link when possible',
                    'List the specific tech stack for each project',
                    'Mention the impact or problem each project solves',
                  ].map(tip => (
                    <div key={tip} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-400">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Preview tab */
        <div>
          <p className="text-sm text-slate-500 mb-5">This is how recruiters will see your portfolio</p>
          <PortfolioPreview
            projects={projects}
            name={profileInfo.name}
            headline={profileInfo.headline}
            github={profileInfo.github}
            website={profileInfo.website}
          />
        </div>
      )}

      {/* Editor modal */}
      {editingProject && (
        <ProjectEditor
          project={editingProject}
          onSave={saveProject}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}
