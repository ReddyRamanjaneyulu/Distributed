export type WorkerStatus = 'ONLINE' | 'OFFLINE' | 'DRAINING';

export interface Worker {
  id: string;
  name: string;
  hostname: string;
  processId: number;
  status: WorkerStatus;
  version?: string | null;
  tags?: Record<string, unknown> | null;
  startedAt: string;
  lastSeenAt?: string | null;
  stoppedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerHeartbeat {
  id: string;
  workerId: string;
  cpuUsage?: number | null;
  memoryUsage?: number | null;
  activeJobs: number;
  queuedJobs: number;
  timestamp: string;
}
