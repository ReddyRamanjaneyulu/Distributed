import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { QueueStatus } from '@prisma/client';

export class CreateQueueDto {
  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  retryPolicyId?: string;

  @IsOptional()
  @IsUUID()
  deadLetterQueueId?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(QueueStatus)
  status: QueueStatus = QueueStatus.ACTIVE;

  @IsOptional()
  @IsInt()
  priority = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  concurrency = 5;

  @IsOptional()
  @IsInt()
  @Min(1)
  visibilityTimeout = 60;

  @IsOptional()
  @IsBoolean()
  paused = false;
}