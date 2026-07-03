import { Injectable } from '@nestjs/common';
import {
  JobStatus,
  WorkerStatus,
  JobType,
  RetryStrategy,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RuntimeRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findRunnableJobs() {
    return this.prisma.job.findMany({
      where: {
        status: JobStatus.QUEUED,
        availableAt: {
          lte: new Date(),
        },
      },
      include: {
        queue: true,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async findAvailableWorkers(queueId: string) {
    return this.prisma.worker.findMany({
      where: {
        status: WorkerStatus.ONLINE,
        assignments: {
          some: {
            queueId,
          },
        },
      },
    });
  }

  async claimJob(
    jobId: string,
    workerId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const job = await tx.job.findUnique({
        where: {
          id: jobId,
        },
      });

      if (!job || job.status !== JobStatus.QUEUED) {
        return null;
      }

      const updatedJob = await tx.job.update({
        where: {
          id: jobId,
        },
        data: {
          status: JobStatus.CLAIMED,
          workerId,
          startedAt: new Date(),
        },
      });

      const execution = await tx.jobExecution.create({
        data: {
          jobId: updatedJob.id,
          workerId,
          attempt: updatedJob.attempts + 1,
          status: JobStatus.RUNNING,
          startedAt: new Date(),
        },
      });

      return {
        job: updatedJob,
        execution,
      };
    });
  }

  async findRetryableJobs() {
    return this.prisma.job.findMany({
      where: {
        status: JobStatus.RETRYING,
        availableAt: {
          lte: new Date(),
        },
      },
      include: {
        queue: {
          include: {
            retryPolicy: true,
          },
        },
      },
    });
  }

  async enqueueRetry(jobId: string) {
    return this.prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        status: JobStatus.QUEUED,
      },
    });
  }

  async findDueSchedules() {
    return this.prisma.scheduledJob.findMany({
      where: {
        enabled: true,
        nextRunAt: {
          lte: new Date(),
        },
      },
      include: {
        queue: true,
      },
    });
  }

  async enqueueScheduledJob(
  scheduledJobId: string,
) {
  const scheduled =
    await this.prisma.scheduledJob.findUnique({
      where: {
        id: scheduledJobId,
      },

      include: {
        queue: {
          include: {
            retryPolicy: true,
          },
        },
      },
    });

  if (!scheduled) {
    return null;
  }

  return this.prisma.job.create({
    data: {
      queueId: scheduled.queueId,

      type: JobType.SCHEDULED,

      status: JobStatus.QUEUED,

      payload:
  scheduled.payload != null
    ? (scheduled.payload as Prisma.InputJsonValue)
    : Prisma.JsonNull,

      priority: scheduled.queue.priority,

      retryStrategy:
        scheduled.queue.retryPolicy?.strategy ??
        RetryStrategy.FIXED,

      maxAttempts:
        scheduled.queue.retryPolicy?.maxAttempts ?? 3,

      baseDelayMs:
        scheduled.queue.retryPolicy?.baseDelayMs ?? 1000,

      availableAt: new Date(),
    },
  });
}

  async updateScheduleNextRun(
    id: string,
    nextRun: Date,
  ) {
    return this.prisma.scheduledJob.update({
      where: {
        id,
      },
      data: {
        lastRunAt: new Date(),
        nextRunAt: nextRun,
      },
    });
  }
}