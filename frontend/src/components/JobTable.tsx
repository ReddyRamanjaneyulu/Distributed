import { Link } from 'react-router-dom';
import {
  ArrowPathIcon,
  XCircleIcon,
  EyeIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

import { StatusChip } from './StatusChip';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './Loading';
import { formatRelativeTime, truncate } from '../utils/formatters';

import type { Job } from '../types';

interface JobTableProps {
  jobs: Job[];
  isLoading?: boolean;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  retryingId?: string;
  cancellingId?: string;
}

export function JobTable({ jobs, isLoading, onRetry, onCancel, retryingId, cancellingId }: JobTableProps) {
  if (isLoading) {
    return (
      <div className="p-4">
        <TableSkeleton rows={6} cols={6} />
      </div>
    );
  }

  if (jobs.length === 0) {
    return <EmptyState icon={InboxIcon} title="No jobs found" description="Jobs will appear here once they're created." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-faint">
            <th className="px-4 py-3 font-medium">Job</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Attempts</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b border-border/60 transition-colors hover:bg-canvas-subtle/60">
              <td className="px-4 py-3 font-mono text-xs text-ink-muted">{truncate(job.id, 18)}</td>
              <td className="px-4 py-3 text-ink-muted">{job.type}</td>
              <td className="px-4 py-3">
                <StatusChip status={job.status} />
              </td>
              <td className="px-4 py-3 text-ink-muted">{job.priority}</td>
              <td className="px-4 py-3 text-ink-muted">
                {job.attempts} / {job.maxAttempts}
              </td>
              <td className="px-4 py-3 text-ink-muted">{formatRelativeTime(job.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-raised hover:text-ink"
                    title="View details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>

                  {onRetry && (job.status === 'FAILED' || job.status === 'DEAD') && (
                    <button
                      onClick={() => onRetry(job.id)}
                      disabled={retryingId === job.id}
                      className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-raised hover:text-accent disabled:opacity-40"
                      title="Retry job"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                  )}

                  {onCancel && (job.status === 'QUEUED' || job.status === 'RETRYING') && (
                    <button
                      onClick={() => onCancel(job.id)}
                      disabled={cancellingId === job.id}
                      className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-raised hover:text-danger disabled:opacity-40"
                      title="Cancel job"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
