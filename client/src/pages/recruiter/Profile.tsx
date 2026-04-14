import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../lib/api';
import { Profile } from '../../types';
import { Save, Loader2 } from 'lucide-react';

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Media', 'Consulting', 'Other'];

export default function RecruiterProfile() {
  const { profile: authProfile, refreshUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<Partial<Profile>>({
    full_name: '', headline: '', location: '', phone: '',
    companyName: '', companySize: '', companyWebsite: '', companyDescription: '', industry: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (authProfile) setForm(authProfile); }, [authProfile]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/profiles/me', form);
      await refreshUser();
      toast('Profile updated!', 'success');
    } catch { toast('Failed to save', 'error'); }
    finally { setSaving(false); }
  };

  const field = (label: string, key: keyof Profile, placeholder: string, opts?: { half?: boolean; select?: string[] }) => (
    <div className={opts?.half ? '' : 'sm:col-span-2'}>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      {opts?.select ? (
        <select className="input-field" value={(form as any)[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
          <option value="" className="bg-surface-800">Select...</option>
          {opts.select.map((o) => <option key={o} value={o} className="bg-surface-800">{o}</option>)}
        </select>
      ) : (
        <input type="text" className="input-field" placeholder={placeholder} value={(form as any)[key] || ''}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      )}
    </div>
  );

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-500 text-sm font-mono mb-1">— COMPANY PROFILE</p>
          <h1 className="font-display text-3xl font-bold text-white">Recruiter Profile</h1>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      <div className="space-y-6">
        {/* Personal */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-white mb-5">Your Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Full Name', 'full_name', 'Your name')}
            {field('Title / Role', 'headline', 'e.g. Head of Talent', { half: true })}
            {field('Location', 'location', 'City, Country', { half: true })}
            {field('Phone', 'phone', '+1 234 567 8900', { half: true })}
          </div>
        </div>

        {/* Company */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-white mb-5">Company Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Company Name', 'companyName', 'Your company name')}
            {field('Industry', 'industry', 'e.g. Technology', { half: true, select: INDUSTRIES })}
            {field('Company Size', 'companySize', '', { half: true, select: COMPANY_SIZES })}
            {field('Company Website', 'companyWebsite', 'https://company.com')}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Company Description</label>
              <textarea
                className="input-field resize-none h-28"
                placeholder="Tell candidates about your company, mission, and culture..."
                value={form.companyDescription || ''}
                onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
