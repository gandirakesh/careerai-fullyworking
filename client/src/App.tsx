import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import JobsPage from './pages/jobs/JobsPage';
import JobDetailPage from './pages/jobs/JobDetailPage';

// Job Seeker
import SeekerDashboard from './pages/seeker/Dashboard';
import SeekerApplications from './pages/seeker/Applications';
import SeekerProfile from './pages/seeker/Profile';
import SeekerResume from './pages/seeker/Resume';
import SeekerPortfolio from './pages/seeker/Portfolio';

// Recruiter
import RecruiterDashboard from './pages/recruiter/Dashboard';
import PostJob from './pages/recruiter/PostJob';
import RecruiterJobs from './pages/recruiter/Jobs';
import RecruiterApplicants from './pages/recruiter/Applicants';
import RecruiterProfile from './pages/recruiter/Profile';

import Navbar from './components/layout/Navbar';
import LoadingScreen from './components/ui/LoadingScreen';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'recruiter' ? '/recruiter' : '/dashboard'} replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={user.role === 'recruiter' ? '/recruiter' : '/dashboard'} replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="mesh-bg min-h-screen">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

        {/* Job Seeker */}
        <Route path="/dashboard" element={<ProtectedRoute role="job_seeker"><SeekerDashboard /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute role="job_seeker"><SeekerApplications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="job_seeker"><SeekerProfile /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute role="job_seeker"><SeekerResume /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute role="job_seeker"><SeekerPortfolio /></ProtectedRoute>} />

        {/* Recruiter */}
        <Route path="/recruiter" element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/post-job" element={<ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>} />
        <Route path="/recruiter/jobs" element={<ProtectedRoute role="recruiter"><RecruiterJobs /></ProtectedRoute>} />
        <Route path="/recruiter/jobs/:id/applicants" element={<ProtectedRoute role="recruiter"><RecruiterApplicants /></ProtectedRoute>} />
        <Route path="/recruiter/profile" element={<ProtectedRoute role="recruiter"><RecruiterProfile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}