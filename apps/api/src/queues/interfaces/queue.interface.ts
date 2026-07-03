import { QueueStatus } from '@prisma/client';

export interface QueueFilters {
  projectId?: string;

  status?: QueueStatus;

  search?: string;

  page?: number;

  limit?: number;
}