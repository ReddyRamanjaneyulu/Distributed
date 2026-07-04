import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Job,
  JobExecution,
  JobLog,
  JobStatus,
  LogLevel,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExecutionRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Poll next available job
   */
  async poll(
  queueId: string,
): Promise<Job | null> {

  // Get queue configuration
  const queue =
    await this.prisma.queue.findUnique({
      where: {
        id: queueId,
      },
    });

  if (!queue) {
    throw new NotFoundException(
      'Queue not found',
    );
  }

  // Queue paused
  if (queue.paused) {
    return null;
  }

  // Running jobs
  const running =
    await this.prisma.job.count({
      where: {
        queueId,
        status: {
          in: [
            JobStatus.CLAIMED,
            JobStatus.RUNNING,
          ],
        },
      },
    });

  // Concurrency reached
  if (running >= queue.concurrency) {
    return null;
  }

  return this.prisma.job.findFirst({
    where: {
      queueId,

      status: JobStatus.QUEUED,

      availableAt: {
        lte: new Date(),
      },
    },

    orderBy: [
      {
        priority: 'desc',
      },
      {
        createdAt: 'asc',
      },
    ],
  });
}
  /**
 * Atomically claim a job
 */
/**
 * Atomically claim a job
 */
async claim(
  jobId: string,
  workerId: string,
): Promise<Job> {
  return this.prisma.$transaction(
    async (tx) => {
      const updated = await tx.job.updateMany({
        where: {
          id: jobId,
          status: JobStatus.QUEUED,
        },

        data: {
          status: JobStatus.CLAIMED,
          workerId: workerId,
          startedAt: new Date(),
        },
      });

      if (updated.count === 0) {
        throw new Error(
          'Job has already been claimed by another worker',
        );
      }

      return tx.job.findUniqueOrThrow({
        where: {
          id: jobId,
        },
      });
    },
  );
}
  /**
   * Create execution record
   */
  async createExecution(
    jobId: string,
    workerId: string,
  ): Promise<JobExecution> {
    const job =
      await this.prisma.job.findUnique({
        where: {
          id: jobId,
        },
      });

    if (!job) {
      throw new NotFoundException(
        'Job not found',
      );
    }

    return this.prisma.jobExecution.create({
      data: {
        attempt:
          job.attempts + 1,

        status:
          JobStatus.RUNNING,

        startedAt:
          new Date(),

        job: {
          connect: {
            id: jobId,
          },
        },

        worker: {
          connect: {
            id: workerId,
          },
        },
      },
    });
  }
    /**
   * Complete execution
   */
  async completeExecution(
    executionId: string,
  ): Promise<JobExecution> {
    return this.prisma.jobExecution.update({
      where: {
        id: executionId,
      },

      data: {
        status: JobStatus.COMPLETED,
        finishedAt: new Date(),
      },
    });
  }

  /**
   * Fail execution
   */
  async failExecution(
    executionId: string,
    message: string,
  ): Promise<JobExecution> {
    return this.prisma.jobExecution.update({
      where: {
        id: executionId,
      },

      data: {
        status: JobStatus.FAILED,
        finishedAt: new Date(),
        errorMessage: message,
      },
    });
  }

  /**
   * Mark job completed
   */
  async completeJob(
    jobId: string,
  ): Promise<Job> {
    return this.prisma.job.update({
      where: {
        id: jobId,
      },

      data: {
        status: JobStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Mark job failed
   */
  async failJob(
    jobId: string,
  ): Promise<Job> {
    return this.prisma.job.update({
      where: {
        id: jobId,
      },

      data: {
        status: JobStatus.FAILED,

        failedAt: new Date(),

        attempts: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Retry job
   */
  async retryJob(
    jobId: string,
    nextRun: Date,
  ): Promise<Job> {
    return this.prisma.job.update({
      where: {
        id: jobId,
      },

      data: {
        status: JobStatus.RETRYING,
        availableAt: nextRun,
      },
    });
  }

  /**
   * Cancel job
   */
  async cancelJob(
    jobId: string,
  ): Promise<Job> {
    return this.prisma.job.update({
      where: {
        id: jobId,
      },

      data: {
        status: JobStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });
  }
    /**
   * Move job to Dead Letter Queue
   */
  async moveToDeadLetter(
    jobId: string,
  ): Promise<Job> {
    return this.prisma.job.update({
      where: {
        id: jobId,
      },

      data: {
        status: JobStatus.DEAD,
        failedAt: new Date(),
      },
    });
  }

  /**
   * Create execution log
   */
  async createLog(
    jobId: string,
    executionId: string,
    level: LogLevel,
    message: string,
  ): Promise<JobLog> {
    return this.prisma.jobLog.create({
      data: {
        job: {
          connect: {
            id: jobId,
          },
        },

        execution: {
          connect: {
            id: executionId,
          },
        },

        level,
        message,
      },
    });
  }

  /**
   * Release worker
   */
  async releaseWorker(
    workerId: string,
  ) {
    return this.prisma.worker.update({
      where: {
        id: workerId,
      },

      data: {
        lastSeenAt: new Date(),
      },
    });
  }

  /**
   * Find execution
   */
  async findExecution(
    id: string,
  ) {
    return this.prisma.jobExecution.findUnique({
      where: {
        id,
      },

      include: {
        job: true,
        worker: true,
        logs: true,
      },
    });
  }
}