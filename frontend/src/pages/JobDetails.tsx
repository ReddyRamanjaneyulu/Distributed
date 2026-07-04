import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowPathIcon, XCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

import { StatusChip } from '../components/StatusChip';
import { Button } from '../components/Button';
import { PageLoading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';

import { useCancelJob, useJob, useJobExecutions, useJobLogs, useRetryJob } from '../hooks/useJobs';
import { formatDate, formatDuration } from '../utils/formatters';

const LOG_LEVEL_STYLES: Record<string, string> = {
  TRACE: 'text-ink-faint',
  DEBUG: 'text-ink-faint',
  INFO: 'text-accent',
  WARN: 'text-warn',
  ERROR: 'text-danger',
  FATAL: 'text-danger',
};

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: job, isLoading } = useJob(id);
  const { data: executions } = useJobExecutions(id);
  const { data: logs } = useJobLogs(id);

  const retryMutation = useRetryJob();
  const cancelMutation = useCancelJob();

  if (isLoading || !job) {
    return <PageLoading label="Loading job" />;
  }

  const canRetry = job.status === 'FAILED' || job.status === 'DEAD';
  const canCancel = job.status === 'QUEUED' || job.status === 'RETRYING';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/jobs"
            className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-subtle hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-sm text-ink-muted">{job.id}</h2>
              <StatusChip status={job.status} />
            </div>
            <p className="text-sm text-ink-muted">Type: {job.type}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {canRetry && (
            <Button
              variant="secondary"
              onClick={() => job.id && retryMutation.mutate(job.id)}
              isLoading={retryMutation.isPending}
            >
              <ArrowPathIcon className="h-4 w-4" />
              Retry
            </Button>
          )}
          {canCancel && (
            <Button
              variant="danger"
              onClick={() => job.id && cancelMutation.mutate(job.id)}
              isLoading={cancelMutation.isPending}
            >
              <XCircleIcon className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="panel p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink">Details</h3>
          <dl className="space-y-2 text-sm">
            <Row label="Priority" value={job.priority} />
            <Row label="Attempts" value={`${job.attempts} / ${job.maxAttempts}`} />
            <Row label="Base Delay" value={`${job.baseDelayMs}ms`} />
            <Row label="Queue ID" value={job.queueId} mono />
            <Row label="Worker ID" value={job.workerId ?? '—'} mono />
            <Row label="Batch ID" value={job.batchId ?? '—'} mono />
          </dl>
        </div>

        <div className="panel p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink">Timeline</h3>
          <dl className="space-y-2 text-sm">
            <Row label="Created" value={formatDate(job.createdAt)} />
            <Row label="Scheduled At" value={formatDate(job.scheduledAt)} />
            <Row label="Started" value={formatDate(job.startedAt)} />
            <Row label="Completed" value={formatDate(job.completedAt)} />
            <Row label="Failed At" value={formatDate(job.failedAt)} />
            <Row label="Cancelled At" value={formatDate(job.cancelledAt)} />
          </dl>
        </div>

        <div className="panel p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink">Payload</h3>
          <pre className="max-h-48 overflow-auto rounded-lg bg-canvas-subtle p-3 font-mono text-xs text-ink-muted">
            {JSON.stringify(job.payload, null, 2)}
          </pre>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="mb-3 font-display text-sm font-semibold text-ink">Execution History</h3>

        {executions && executions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-faint">
                  <th className="px-3 py-2 font-medium">Attempt</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Duration</th>
                  <th className="px-3 py-2 font-medium">Exit Code</th>
                  <th className="px-3 py-2 font-medium">Started</th>
                  <th className="px-3 py-2 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((exec) => (
                  <tr key={exec.id} className="border-b border-border/60">
                    <td className="px-3 py-2 text-ink-muted">#{exec.attempt}</td>
                    <td className="px-3 py-2">
                      <StatusChip status={exec.status} />
                    </td>
                    <td className="px-3 py-2 text-ink-muted">{formatDuration(exec.durationMs)}</td>
                    <td className="px-3 py-2 text-ink-muted">{exec.exitCode ?? '—'}</td>
                    <td className="px-3 py-2 text-ink-muted">{formatDate(exec.startedAt)}</td>
                    <td className="px-3 py-2 max-w-xs truncate text-danger">{exec.errorMessage ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={DocumentTextIcon} title="No execution attempts yet" />
        )}
      </div>

      <div className="panel p-5">
        <h3 className="mb-3 font-display text-sm font-semibold text-ink">Logs</h3>

        {logs && logs.length > 0 ? (
          <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg bg-canvas-subtle p-3 font-mono text-xs">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2">
                <span className="shrink-0 text-ink-faint">{formatDate(log.createdAt)}</span>
                <span className={`shrink-0 font-semibold ${LOG_LEVEL_STYLES[log.level] ?? 'text-ink-muted'}`}>
                  [{log.level}]
                </span>
                <span className="text-ink-muted">{log.message}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={DocumentTextIcon} title="No logs recorded" />
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="shrink-0 text-ink-faint">{label}</dt>
      <dd className={`truncate text-right font-medium text-ink ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  );
}
