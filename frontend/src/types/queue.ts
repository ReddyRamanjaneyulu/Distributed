import type { Project } from './project';
import type { RetryPolicy } from './retryPolicy';

export type QueueStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export interface DeadLetterQueue {
  id: string;
  name: string;
  description?: string | null;
}

export interface Queue {
  id: string;
  name: string;
  description?: string | null;
  status: QueueStatus;
  priority: number;
  concurrency: number;
  visibilityTimeout: number;
  paused: boolean;
  projectId: string;
  project?: Project;
  retryPolicyId?: string | null;
  retryPolicy?: RetryPolicy | null;
  deadLetterQueueId?: string | null;
  deadLetterQueue?: DeadLetterQueue | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQueuePayload {
  name: string;
  description?: string;
  status?: QueueStatus;
  priority?: number;
  concurrency?: number;
  visibilityTimeout?: number;
  paused?: boolean;
  projectId: string;
  retryPolicyId?: string;
  deadLetterQueueId?: string;
}

export type UpdateQueuePayload = Partial<Omit<CreateQueuePayload, 'projectId'>>;

export interface QueueStatistics {
  queue: Queue;
  statistics: {
    totalJobs: number;
    queued: number;
    claimed: number;
    running: number;
    completed: number;
    failed: number;
    retrying: number;
    cancelled: number;
    scheduled: number;
    dead: number;
    successRate: number;
    failureRate: number;
  };
}

export interface QueueMetrics {
  queueId: string;
  totalJobs: number;
  queued: number;
  running: number;
  failed: number;
  dead: number;
  assignedWorkers: number;
}
