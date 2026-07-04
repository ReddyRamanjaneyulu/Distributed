export type RetryStrategy = 'FIXED' | 'LINEAR' | 'EXPONENTIAL';

export interface RetryPolicy {
  id: string;
  name: string;
  strategy: RetryStrategy;
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs?: number | null;
  jitter: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRetryPolicyPayload {
  name: string;
  strategy: RetryStrategy;
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs?: number;
  jitter?: boolean;
}

export type UpdateRetryPolicyPayload = Partial<CreateRetryPolicyPayload>;
