export class ScheduledJobResponseDto {
  id: string;

  name: string;

  cronExpression: string;

  timezone: string;

  enabled: boolean;

  payload: any;

  nextRunAt?: Date | null;

  lastRunAt?: Date | null;

  queueId: string;

  createdAt: Date;

  updatedAt: Date;
}