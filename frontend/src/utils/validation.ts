import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const projectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  organizationId: z.string().min(1, 'Organization is required'),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const queueSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  priority: z.coerce.number().int().min(0).default(0),
  concurrency: z.coerce.number().int().min(1).default(5),
  visibilityTimeout: z.coerce.number().int().min(1).default(60),
  retryPolicyId: z.string().optional(),
});

export type QueueFormValues = z.infer<typeof queueSchema>;

export const retryPolicySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  strategy: z.enum(['FIXED', 'LINEAR', 'EXPONENTIAL']),
  maxAttempts: z.coerce.number().int().min(1),
  baseDelayMs: z.coerce.number().int().min(0),
  maxDelayMs: z.coerce.number().int().min(0).optional(),
  jitter: z.boolean().default(false),
});

export type RetryPolicyFormValues = z.infer<typeof retryPolicySchema>;

export const scheduledJobSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  cronExpression: z.string().min(1, 'Cron expression is required'),
  timezone: z.string().min(1).default('UTC'),
  queueId: z.string().min(1, 'Queue is required'),
  enabled: z.boolean().default(true),
  payload: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Payload must be valid JSON' },
  ),
});

export type ScheduledJobFormValues = z.infer<typeof scheduledJobSchema>;
