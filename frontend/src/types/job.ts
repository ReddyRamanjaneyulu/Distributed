export type JobType = 'IMMEDIATE' | 'DELAYED' | 'SCHEDULED' | 'CRON' | 'BATCH';

export type JobStatus =
  | 'QUEUED'
  | 'CLAIMED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'RETRYING'
  | 'CANCELLED'
  | 'DEAD';

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  payload: Record<string, unknown>;
  priority: number;
  maxAttempts: number;
  baseDelayMs: number;
  attempts: number;
  scheduledAt?: string | null;
  availableAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  timeoutAt?: string | null;
  cancelledAt?: string | null;
  queueId: string;
  workerId?: string | null;
  batchId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobExecution {
  id: string;
  attempt: number;
  status: JobStatus;
  startedAt: string;
  finishedAt?: string | null;
  durationMs?: number | null;
  exitCode?: number | null;
  errorMessage?: string | null;
  stackTrace?: string | null;
  workerId?: string | null;
  jobId: string;
  createdAt: string;
}

export interface JobLog {
  id: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  jobId: string;
  executionId?: string | null;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobStatus;
  priority?: number;
  queueId?: string;
}
