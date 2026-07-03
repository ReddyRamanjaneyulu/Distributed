import {
  JobStatus,
  JobType,
  RetryStrategy,
} from '@prisma/client';

export class JobResponseDto {
  id: string;

  queueId: string;

  workerId?: string | null;

  batchId?: string | null;

  type: JobType;

  status: JobStatus;

  payload: object;

  priority: number;

  retryStrategy: RetryStrategy;

  maxAttempts: number;

  baseDelayMs: number;

  attempts: number;

  scheduledAt?: Date | null;

  availableAt?: Date | null;

  startedAt?: Date | null;

  completedAt?: Date | null;

  failedAt?: Date | null;

  timeoutAt?: Date | null;

  cancelledAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}