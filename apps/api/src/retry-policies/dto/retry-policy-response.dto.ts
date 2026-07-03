import { RetryStrategy } from '@prisma/client';

export class RetryPolicyResponseDto {
  id: string;

  name: string;

  strategy: RetryStrategy;

  maxAttempts: number;

  baseDelayMs: number;

  maxDelayMs?: number | null;

  jitter: boolean;

  createdAt: Date;

  updatedAt: Date;
}