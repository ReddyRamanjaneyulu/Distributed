import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PauseIcon,
  PlayIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

import { StatCard } from '../components/StatCard';
import { StatusChip } from '../components/StatusChip';
import { Button } from '../components/Button';
import { JobTable } from '../components/JobTable';
import { PageLoading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';

import {
  useQueue,
  useQueueDeadJobs,
  useQueueFailedJobs,
  useQueueMetrics,
  useQueueRecentJobs,
  useQueueStatistics,
  useQueueWorkers,
  usePauseQueue,
  useResumeQueue,
} from '../hooks/useQueues';
import { useRetryJob, useCancelJob } from '../hooks/useJobs';
import { formatNumber, formatPercent } from '../utils/formatters';

type TabKey = 'recent' | 'failed' | 'dead';

export default function QueueDetails() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<TabKey>('recent');

  const { data: queue, isLoading: queueLoading } = useQueue(id);
  const { data: stats } = useQueueStatistics(id);
  const { data: metrics } = useQueueMetrics(id);
  const { data: workers } = useQueueWorkers(id);

  const { data: recentJobs, isLoading: recentLoading } = useQueueRecentJobs(id, 20);
  const { data: failedJobs, isLoading: failedLoading } = useQueueFailedJobs(id, 50);
  const { data: deadJobs, isLoading: deadLoading } = useQueueDeadJobs(id, 50);

  const pauseMutation = usePauseQueue();
  const resumeMutation = useResumeQueue();
  const retryMutation = useRetryJob();
  const cancelMutation = useCancelJob();

  if (queueLoading || !queue) {
    return <PageLoading label="Loading queue" />;
  }

  const activeJobs = tab === 'recent' ? recentJobs : tab === 'failed' ? failedJobs : deadJobs;
  const activeLoading = tab === 'recent' ? recentLoading : tab === 'failed' ? failedLoading : deadLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/queues"
            className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-subtle hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-ink">{queue.name}</h2>
              <StatusChip status={queue.status} />
            </div>
            <p className="text-sm text-ink-muted">{queue.description || 'No description'}</p>
          </div>
        </div>

        {queue.paused ? (
          <Button onClick={() => resumeMutation.mutate(queue.id)} isLoading={resumeMutation.isPending}>
            <PlayIcon className="h-4 w-4" />
            Resume Queue
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => pauseMutation.mutate(queue.id)}
            isLoading={pauseMutation.isPending}
          >
            <PauseIcon className="h-4 w-4" />
            Pause Queue
          </Button>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Jobs" value={formatNumber(stats.statistics.totalJobs)} />
          <StatCard label="Running" value={formatNumber(stats.statistics.running)} accent="default" />
          <StatCard label="Completed" value={formatNumber(stats.statistics.completed)} accent="ok" />
          <StatCard label="Failed" value={formatNumber(stats.statistics.failed)} accent="danger" />
          <StatCard label="Retrying" value={formatNumber(stats.statistics.retrying)} accent="warn" />
          <StatCard label="Dead" value={formatNumber(stats.statistics.dead)} accent="dead" />
          <StatCard label="Success Rate" value={formatPercent(stats.statistics.successRate)} accent="ok" />
          <StatCard label="Failure Rate" value={formatPercent(stats.statistics.failureRate)} accent="danger" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="panel p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink">Configuration</h3>
          <dl className="space-y-2 text-sm">
            <Row label="Priority" value={queue.priority} />
            <Row label="Concurrency" value={queue.concurrency} />
            <Row label="Visibility Timeout" value={`${queue.visibilityTimeout}s`} />
            <Row label="Retry Policy" value={queue.retryPolicy?.name ?? 'None'} />
            <Row label="Dead Letter Queue" value={queue.deadLetterQueue?.name ?? 'None'} />
            <Row label="Project" value={queue.project?.name ?? '—'} />
          </dl>
        </div>

        <div className="panel p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink">Metrics</h3>
          {metrics ? (
            <dl className="space-y-2 text-sm">
              <Row label="Assigned Workers" value={metrics.assignedWorkers} />
              <Row label="Queued" value={metrics.queued} />
              <Row label="Running" value={metrics.running} />
              <Row label="Failed" value={metrics.failed} />
              <Row label="Dead" value={metrics.dead} />
            </dl>
          ) : (
            <p className="text-sm text-ink-faint">No metrics available</p>
          )}
        </div>

        <div className="panel p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink">Workers Assigned</h3>
          {workers && workers.length > 0 ? (
            <ul className="space-y-2">
              {workers.map((worker) => (
                <li key={worker.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-ink-muted">{worker.name}</span>
                  <StatusChip status={worker.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={ServerStackIcon} title="No workers assigned" />
          )}
        </div>
      </div>

      <div className="panel">
        <div className="flex gap-1 border-b border-border px-4 pt-3">
          {(
            [
              { key: 'recent', label: 'Recent Jobs' },
              { key: 'failed', label: 'Failed Jobs' },
              { key: 'dead', label: 'Dead Letter Jobs' },
            ] as { key: TabKey; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                'rounded-t-lg px-4 py-2 text-sm font-medium transition-colors',
                tab === t.key
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <JobTable
          jobs={activeJobs ?? []}
          isLoading={activeLoading}
          onRetry={(jobId) => retryMutation.mutate(jobId)}
          onCancel={(jobId) => cancelMutation.mutate(jobId)}
          retryingId={retryMutation.isPending ? retryMutation.variables : undefined}
          cancellingId={cancelMutation.isPending ? cancelMutation.variables : undefined}
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
