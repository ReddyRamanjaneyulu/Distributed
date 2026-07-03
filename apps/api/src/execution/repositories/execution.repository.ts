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
   * Find next available job
   */
  async poll(queueId: string): Promise<Job | null> {
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
   * Claim job
   */
  async claim(
    jobId: string,
    workerId: string,
  ): Promise<Job> {
    return this.prisma.job.update({
      where: {
        id: jobId,
      },

      data: {
        status: JobStatus.CLAIMED,

        worker: {
          connect: {
            id: workerId,
          },
        },

        startedAt: new Date(),
      },
    });
  }

  /**
   * Start execution
   */
  async createExecution(
  jobId: string,
  workerId: string,
): Promise<JobExecution> {
  const job = await this.prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  return this.prisma.jobExecution.create({
    data: {
      attempt: job.attempts + 1,

      status: JobStatus.RUNNING,

      startedAt: new Date(),

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
      finishedAt: new Date(),

      status: JobStatus.COMPLETED,
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
      finishedAt: new Date(),

      status: JobStatus.FAILED,

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
 * Create log
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