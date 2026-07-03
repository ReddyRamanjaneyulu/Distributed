import {
  IsDateString,
  IsEnum,
  IsInt,
  IsJSON,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

import {
  JobType,
  RetryStrategy,
} from '@prisma/client';

export class CreateJobDto {
  @IsUUID()
  queueId: string;

  @IsOptional()
  @IsUUID()
  batchId?: string;

  @IsEnum(JobType)
  type: JobType;

  @IsJSON()
  payload: object;

  @IsOptional()
  @IsInt()
  priority = 0;

  @IsEnum(RetryStrategy)
  retryStrategy: RetryStrategy;

  @IsInt()
  @Min(1)
  maxAttempts: number;

  @IsInt()
  @Min(0)
  baseDelayMs: number;

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;

  @IsOptional()
  @IsDateString()
  availableAt?: Date;
}