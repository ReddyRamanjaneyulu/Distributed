import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { RetryStrategy } from '@prisma/client';

export class CreateRetryPolicyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEnum(RetryStrategy)
  strategy: RetryStrategy;

  @IsInt()
  @Min(1)
  @Max(100)
  maxAttempts: number;

  @IsInt()
  @Min(0)
  baseDelayMs: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxDelayMs?: number;

  @IsOptional()
  @IsBoolean()
  jitter?: boolean = false;
}