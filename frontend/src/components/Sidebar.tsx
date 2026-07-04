import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  Squares2X2Icon,
  FolderIcon,
  QueueListIcon,
  BoltIcon,
  ServerStackIcon,
  ArrowPathRoundedSquareIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: Squares2X2Icon, end: true },
  { to: '/projects', label: 'Projects', icon: FolderIcon },
  { to: '/queues', label: 'Queues', icon: QueueListIcon },
  { to: '/jobs', label: 'Jobs', icon: BoltIcon },
  { to: '/workers', label: 'Workers', icon: ServerStackIcon },
  { to: '/retry-policies', label: 'Retry Policies', icon: ArrowPathRoundedSquareIcon },
  { to: '/scheduled-jobs', label: 'Scheduled Jobs', icon: CalendarDaysIcon },
  { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
];

export function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-canvas-subtle">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
          <BoltIcon className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-ink">Scheduler</p>
          <p className="text-[11px] text-ink-faint">Orchestration Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-ink-muted hover:bg-canvas-raised hover:text-ink',
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-xs font-semibold text-accent">
            {(user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{user?.name ?? 'User'}</p>
            <p className="truncate text-xs text-ink-faint">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-raised hover:text-danger"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
