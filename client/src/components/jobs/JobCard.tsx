import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Users, Zap } from 'lucide-react';
import { Job } from '../../types';

interface Props {
  job: Job;
  matchScore?: number;
  applied?: boolean;
}

const typeColors: Record<string, string> = {
  'full-time': 'badge-blue',
  'part-time': 'badge-purple',
  'contract': 'badge-amber',
  'internship': 'badge-green',
  'remote': 'badge-green',
};

const levelColors: Record<string, string> = {
  entry: 'badge-green',
  mid: 'badge-blue',
  senior: 'badge-purple',
  lead: 'badge-amber',
  executive: 'badge-red',
};

export default function JobCard({ job, matchScore, applied }: Props) {
  const salary = job.salary
    ? `$${(job.salary.min / 1000).toFixed(0)}k–$${(job.salary.max / 1000).toFixed(0)}k`
    : null;

  return (
    <Link to={`/jobs/${job._id}`} className="block">
      <div className="card glass-hover group cursor-pointer relative overflow-hidden">
        {applied && (
          <div className="absolute top-4 right-4">
            <span className="badge-green text-xs">Applied</span>
          </div>
        )}
        {matchScore !== undefined && matchScore > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-1 badge-blue">
            <Zap className="w-3 h-3" />
            <span className="text-xs font-mono">{matchScore}% match</span>
          </div>
        )}

        {/* Company avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-500 to-surface-600 border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-white font-display font-bold text-lg">
            {job.company[0]}
          </div>
          <div className="min-w-0 flex-1 pr-8">
            <h3 className="font-display font-semibold text-white group-hover:text-sky-300 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-slate-400 text-sm mt-0.5">{job.company}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={typeColors[job.type] || 'badge-blue'}>{job.type}</span>
          <span className={levelColors[job.experienceLevel] || 'badge-blue'}>{job.experienceLevel}</span>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {job.location}
          </span>
          {salary && (
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> {salary}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> {job.applicantCount} applicants
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/[0.05]">
            {job.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="px-2 py-0.5 rounded-md text-xs bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-xs text-slate-600">+{job.skills.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
