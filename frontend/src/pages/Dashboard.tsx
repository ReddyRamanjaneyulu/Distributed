import {
  FolderIcon,
  QueueListIcon,
  BoltIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArchiveBoxXMarkIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline';

import { StatCard } from '../components/StatCard';
import { JobTable } from '../components/JobTable';
import { PageLoading } from '../components/Loading';
import { ProgressBar } from '../components/ProgressBar';
import { JobStatusPieChart } from '../components/charts/JobStatusPieChart';
import { JobsPerQueueChart } from '../components/charts/JobsPerQueueChart';
import { WorkerActivityChart } from '../components/charts/WorkerActivityChart';
import { ExecutionTimelineChart } from '../components/charts/ExecutionTimelineChart';
import { useDashboard } from '../hooks/useDashboard';
import { useWorkers, useWorkerHeartbeats } from '../hooks/useWorkers';
import { formatNumber, formatPercent } from '../utils/formatters';

export default function Dashboard() {
  const { data, isLoading } = useDashboard();
  const { data: workersPage } = useWorkers({ page: 1, limit: 1 });
  const firstWorkerId = workersPage?.items[0]?.id;
  const { data: heartbeats } = useWorkerHeartbeats(firstWorkerId);

  if (isLoading || !data) {
    return <PageLoading label="Loading dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Projects" value={formatNumber(data.totalProjects)} icon={FolderIcon} />
        <StatCard label="Queues" value={formatNumber(data.totalQueues)} icon={QueueListIcon} />
        <StatCard label="Total Jobs" value={formatNumber(data.totalJobs)} icon={BoltIcon} />
        <StatCard
          label="Running Jobs"
          value={formatNumber(data.runningJobs)}
          icon={PlayCircleIcon}
          accent="default"
        />
        <StatCard
          label="Completed Jobs"
          value={formatNumber(data.completedJobs)}
          icon={CheckCircleIcon}
          accent="ok"
        />
        <StatCard
          label="Failed Jobs"
          value={formatNumber(data.failedJobs)}
          icon={XCircleIcon}
          accent="danger"
        />
        <StatCard
          label="Dead Letter Jobs"
          value={formatNumber(data.deadJobs)}
          icon={ArchiveBoxXMarkIcon}
          accent="dead"
        />
        <StatCard
          label="Workers Online"
          value={`${data.workersOnline} / ${data.totalWorkers}`}
          icon={ServerStackIcon}
          accent="ok"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-1">
          <h3 className="font-display text-sm font-semibold text-ink">Job Status</h3>
          <JobStatusPieChart
            data={{
              running: data.runningJobs,
              completed: data.completedJobs,
              failed: data.failedJobs,
              dead: data.deadJobs,
              queued: data.queuedJobs,
              retrying: data.retryingJobs,
            }}
          />
        </div>

        <div className="panel p-5 lg:col-span-2">
          <h3 className="font-display text-sm font-semibold text-ink">Jobs Per Queue</h3>
          <JobsPerQueueChart data={data.queueJobCounts} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h3 className="font-display text-sm font-semibold text-ink">Worker Activity</h3>
          <p className="mb-2 text-xs text-ink-faint">Sampled from the first active worker's heartbeats</p>
          <WorkerActivityChart heartbeats={heartbeats ?? []} />
        </div>

        <div className="panel p-5">
          <h3 className="font-display text-sm font-semibold text-ink">Execution Timeline</h3>
          <p className="mb-2 text-xs text-ink-faint">Completed vs. failed jobs, bucketed hourly</p>
          <ExecutionTimelineChart jobs={data.recentJobs} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-1">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink">Queue Health</h3>

          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs text-ink-muted">
                <span>Success Rate</span>
                <span>{formatPercent(data.successRate)}</span>
              </div>
              <ProgressBar value={data.successRate} variant="ok" />
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs text-ink-muted">
                <span>Failure Rate</span>
                <span>{formatPercent(data.failureRate)}</span>
              </div>
              <ProgressBar value={data.failureRate} variant="danger" />
            </div>
          </div>
        </div>

        <div className="panel lg:col-span-2">
          <div className="flex items-center justify-between px-5 pt-5">
            <h3 className="font-display text-sm font-semibold text-ink">Recent Jobs</h3>
          </div>
          <JobTable jobs={data.recentJobs} />
        </div>
      </div>
    </div>
  );
}
