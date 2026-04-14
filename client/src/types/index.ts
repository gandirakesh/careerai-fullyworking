export interface User {
  _id: string;
  email: string;
  role: 'job_seeker' | 'recruiter';
  avatar?: string;
  googleId?: string;
  notifications: Notification[];
  createdAt: string;
}

export interface Profile {
  _id: string;
  userId: string;
  full_name: string;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  resumeUrl?: string;
  companyName?: string;
  companySize?: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
}

export interface Experience {
  _id?: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary?: { min: number; max: number; currency: string };
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  recruiterId: string | User;
  status: 'active' | 'closed' | 'draft';
  applicantCount: number;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  createdAt: string;
}

export interface Application {
  _id: string;
  jobId: Job | string;
  userId: User | string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'accepted' | 'rejected';
  coverLetter?: string;
  resumeUrl?: string;
  recruiterNotes?: string;
  matchScore: number;
  profile?: Profile;
  createdAt: string;
}

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: string, full_name: string) => Promise<void>;
  googleAuth: (credential: string, role?: string) => Promise<{ needsRole?: boolean }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  pages: number;
  currentPage: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
