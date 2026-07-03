import {
  JobStatus,
  JobType,
} from '@prisma/client';

export interface JobFilters {
  queueId?: string;

  workerId?: string;

  batchId?: string;

  status?: JobStatus;

  type?: JobType;

  page?: number;

  limit?: number;
}