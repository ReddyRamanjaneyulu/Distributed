import { QueueStatus } from '@prisma/client';

export class QueueResponseDto {
  id: string;

  projectId: string;

  retryPolicyId?: string | null;

  deadLetterQueueId?: string | null;

  name: string;

  description?: string | null;

  status: QueueStatus;

  priority: number;

  concurrency: number;

  visibilityTimeout: number;

  paused: boolean;

  createdAt: Date;

  updatedAt: Date;
}