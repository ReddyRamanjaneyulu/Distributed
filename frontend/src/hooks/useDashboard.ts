import { useQuery } from '@tanstack/react-query';

import { projectsApi } from '../api/projects';
import { queuesApi } from '../api/queues';
import { jobsApi } from '../api/jobs';
import { workersApi } from '../api/workers';

import type { Job, JobStatus, Queue } from '../types';

/**
 * ASSUMPTION: the backend does not expose a single aggregate
 * "/dashboard" endpoint. This hook composes the dashboard view from
 * the existing list + statistics endpoints instead:
 *   - /projects, /queues, /workers for totals
 *   - /jobs for status breakdown (paginated, so we fetch a high limit)
 *   - /queues/:id/statistics for a per-queue job count (limited to the
 *     first 8 queues to bound the number of requests fired)
 * If a dedicated aggregate endpoint exists on your API, swap this
 * hook's body for a single call to it.
 */

const JOB_STATUS_SAMPLE_LIMIT = 500;
const PER_QUEUE_STATS_LIMIT = 8;

export interface DashboardSnapshot {
  totalProjects: number;
  totalQueues: number;
  totalJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  deadJobs: number;
  queuedJobs: number;
  retryingJobs: number;
  workersOnline: number;
  totalWorkers: number;
  successRate: number;
  failureRate: number;
  queues: Queue[];
  queueJobCounts: { name: string; totalJobs: number }[];
  recentJobs: Job[];
}

function countByStatus(jobs: Job[], status: JobStatus): number {
  return jobs.filter((job) => job.status === status).length;
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard-snapshot'],
    refetchInterval: 15_000,
    queryFn: async (): Promise<DashboardSnapshot> => {
      const [projectsRes, queuesRes, jobsRes, workersRes] = await Promise.all([
        projectsApi.list({ page: 1, limit: 1 }),
        queuesApi.list({ page: 1, limit: 100 }),
        jobsApi.list({ page: 1, limit: JOB_STATUS_SAMPLE_LIMIT }),
        workersApi.list({ page: 1, limit: 100 }),
      ]);

      const jobs = jobsRes.items;

      const totalJobs = jobsRes.total;
      const runningJobs = countByStatus(jobs, 'RUNNING');
      const completedJobs = countByStatus(jobs, 'COMPLETED');
      const failedJobs = countByStatus(jobs, 'FAILED');
      const deadJobs = countByStatus(jobs, 'DEAD');
      const queuedJobs = countByStatus(jobs, 'QUEUED');
      const retryingJobs = countByStatus(jobs, 'RETRYING');

      const sampleSize = jobs.length || 1;
      const successRate = Number(((completedJobs / sampleSize) * 100).toFixed(1));
      const failureRate = Number((((failedJobs + deadJobs) / sampleSize) * 100).toFixed(1));

      const workersOnline = workersRes.items.filter((w) => w.status === 'ONLINE').length;

      const recentJobs = [...jobs]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

      const statsQueues = queuesRes.items.slice(0, PER_QUEUE_STATS_LIMIT);

      const queueJobCounts = await Promise.all(
        statsQueues.map(async (queue) => {
          try {
            const stats = await queuesApi.getStatistics(queue.id);
            return { name: queue.name, totalJobs: stats.statistics.totalJobs };
          } catch {
            return { name: queue.name, totalJobs: 0 };
          }
        }),
      );

      return {
        totalProjects: projectsRes.total,
        totalQueues: queuesRes.total,
        totalJobs,
        runningJobs,
        completedJobs,
        failedJobs,
        deadJobs,
        queuedJobs,
        retryingJobs,
        workersOnline,
        totalWorkers: workersRes.total,
        successRate,
        failureRate,
        queues: queuesRes.items,
        queueJobCounts,
        recentJobs,
      };
    },
  });
}
