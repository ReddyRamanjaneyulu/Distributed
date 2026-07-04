import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Queues from './pages/Queues';
import QueueDetails from './pages/QueueDetails';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Workers from './pages/Workers';
import RetryPolicies from './pages/RetryPolicies';
import ScheduledJobs from './pages/ScheduledJobs';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/queues" element={<Queues />} />
          <Route path="/queues/:id" element={<QueueDetails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/retry-policies" element={<RetryPolicies />} />
          <Route path="/scheduled-jobs" element={<ScheduledJobs />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
