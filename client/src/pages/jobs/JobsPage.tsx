import { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api';
import { Job, JobsResponse } from '../../types';
import JobCard from '../../components/jobs/JobCard';
import { Search, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const JOB_TYPES = ['', 'full-time', 'part-time', 'contract', 'internship', 'remote'];
const LEVELS = ['', 'entry', 'mid', 'senior', 'lead', 'executive'];

export default function JobsPage() {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 12 };
      if (search) params.search = search;
      if (location) params.location = location;
      if (type) params.type = type;
      if (level) params.experienceLevel = level;
      const { data: res } = await api.get('/jobs', { params });
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [search, location, type, level, page]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, 300);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Browse <span className="gradient-text">Opportunities</span>
        </h1>
        <p className="text-slate-400">{data?.total ?? '—'} jobs available right now</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-8 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-52">
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none flex-1"
          />
        </div>
        <div className="w-px bg-white/[0.06]" />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => { setLocation(e.target.value); setPage(1); }}
          className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none w-36"
        />
        <div className="w-px bg-white/[0.06]" />
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="bg-transparent text-sm text-slate-400 outline-none cursor-pointer"
        >
          {JOB_TYPES.map((t) => (
            <option key={t} value={t} className="bg-surface-800">{t || 'All Types'}</option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => { setLevel(e.target.value); setPage(1); }}
          className="bg-transparent text-sm text-slate-400 outline-none cursor-pointer"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l} className="bg-surface-800">{l || 'All Levels'}</option>
          ))}
        </select>
      </div>

      {/* Jobs grid */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
        </div>
      ) : !data || data.jobs.length === 0 ? (
        <div className="text-center py-32">
          <Filter className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-display">No jobs found</p>
          <p className="text-slate-600 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {data.jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary py-2 px-3 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-400 text-sm font-mono px-4">
                {page} / {data.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="btn-secondary py-2 px-3 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
