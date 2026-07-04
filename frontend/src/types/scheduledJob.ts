export interface ScheduledJob {
  id: string;
  name: string;
  cronExpression: string;
  timezone: string;
  enabled: boolean;
  payload: Record<string, unknown>;
  nextRunAt?: string | null;
  lastRunAt?: string | null;
  queueId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduledJobPayload {
  name: string;
  cronExpression: string;
  timezone?: string;
  enabled?: boolean;
  payload: Record<string, unknown>;
  queueId: string;
}

export type UpdateScheduledJobPayload = Partial<CreateScheduledJobPayload>;
