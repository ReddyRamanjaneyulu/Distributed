import { WorkerStatus } from '@prisma/client';

export class WorkerResponseDto {
  id: string;

  name: string;

  hostname: string;

  processId: number;

  status: WorkerStatus;

  version?: string | null;

  tags?: object | null;

  startedAt: Date;

  lastSeenAt?: Date | null;

  stoppedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}