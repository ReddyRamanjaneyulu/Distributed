import { Outlet, useLocation } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Real-time overview of your job scheduling infrastructure' },
  '/projects': { title: 'Projects', subtitle: 'Manage projects across your organization' },
  '/queues': { title: 'Queues', subtitle: 'Monitor throughput, pause, and resume queues' },
  '/jobs': { title: 'Jobs', subtitle: 'Search, filter, retry, and cancel jobs' },
  '/workers': { title: 'Workers', subtitle: 'Worker fleet health and heartbeat activity' },
  '/retry-policies': { title: 'Retry Policies', subtitle: 'Configure backoff strategies for failed jobs' },
  '/scheduled-jobs': { title: 'Scheduled Jobs', subtitle: 'Cron-based and recurring job schedules' },
  '/settings': { title: 'Settings', subtitle: 'Account and workspace preferences' },
};

function resolveTitle(pathname: string): { title: string; subtitle: string } {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];

  const segment = `/${pathname.split('/')[1] ?? ''}`;
  return ROUTE_TITLES[segment] ?? { title: 'Scheduler', subtitle: '' };
}

export function DashboardLayout() {
  const location = useLocation();
  const { title, subtitle } = resolveTitle(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar title={title} subtitle={subtitle} />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
