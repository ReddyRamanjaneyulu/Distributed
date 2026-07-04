import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../prisma/prisma.service';

import {
  Prisma,
  Queue,
  QueueStatus,
  JobStatus,
  JobType,
  WorkerStatus,
} from '@prisma/client';

import { CreateQueueDto } from '../dto/create-queue.dto';

@Injectable()
export class QueueRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create Queue
   */
  async create(
    dto: CreateQueueDto,
  ): Promise<Queue> {
    return this.prisma.queue.create({
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        concurrency: dto.concurrency,
        visibilityTimeout: dto.visibilityTimeout,
        paused: dto.paused,

        project: {
          connect: {
            id: dto.projectId,
          },
        },

        ...(dto.retryPolicyId && {
          retryPolicy: {
            connect: {
              id: dto.retryPolicyId,
            },
          },
        }),

        ...(dto.deadLetterQueueId && {
          deadLetterQueue: {
            connect: {
              id: dto.deadLetterQueueId,
            },
          },
        }),
      },

      include: {
        project: true,
        retryPolicy: true,
        deadLetterQueue: true,
      },
    });
  }

  /**
   * Find Queue by ID
   */
  async findById(
    id: string,
  ): Promise<Queue | null> {
    return this.prisma.queue.findUnique({
      where: {
        id,
      },

      include: {
        project: true,
        retryPolicy: true,
        deadLetterQueue: true,
      },
    });
  }

  /**
   * Find Queue by Name
   */
  async findByName(
    projectId: string,
    name: string,
  ): Promise<Queue | null> {
    return this.prisma.queue.findFirst({
      where: {
        projectId,
        name,
      },
    });
  }

  /**
   * List Queues
   */
  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.QueueWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [items, total] =
      await this.prisma.$transaction([
        this.prisma.queue.findMany({
          where,
          skip,
          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            project: true,
            retryPolicy: true,
            deadLetterQueue: true,
          },
        }),

        this.prisma.queue.count({
          where,
        }),
      ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit,
      ),
    };
  }

  /**
   * Update Queue
   */
  async update(
    id: string,
    data: Prisma.QueueUpdateInput,
  ): Promise<Queue> {
    const queue =
      await this.findById(id);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    return this.prisma.queue.update({
      where: {
        id,
      },

      data,

      include: {
        project: true,
        retryPolicy: true,
        deadLetterQueue: true,
      },
    });
  }

  /**
   * Delete Queue
   */
  async delete(
    id: string,
  ): Promise<Queue> {
    const queue =
      await this.findById(id);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    return this.prisma.queue.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Check Queue Exists
   */
  async exists(
    id: string,
  ): Promise<boolean> {
    const count =
      await this.prisma.queue.count({
        where: {
          id,
        },
      });

    return count > 0;
  }

  /**
   * Pause Queue
   */
  async pauseQueue(
    id: string,
  ): Promise<Queue> {
    const queue =
      await this.findById(id);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    return this.prisma.queue.update({
      where: {
        id,
      },

      data: {
        paused: true,
        status: QueueStatus.PAUSED,
      },

      include: {
        project: true,
        retryPolicy: true,
        deadLetterQueue: true,
      },
    });
  }

  /**
   * Resume Queue
   */
  async resumeQueue(
    id: string,
  ): Promise<Queue> {
    const queue =
      await this.findById(id);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    return this.prisma.queue.update({
      where: {
        id,
      },

      data: {
        paused: false,
        status: QueueStatus.ACTIVE,
      },

      include: {
        project: true,
        retryPolicy: true,
        deadLetterQueue: true,
      },
    });
  }

  /**
   * Queue Statistics
   */
  async getQueueStatistics(
    queueId: string,
  ) {
    const queue =
      await this.findById(queueId);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    const [
      totalJobs,
      queued,
      claimed,
      running,
      completed,
      failed,
      retrying,
      cancelled,
      scheduled,
      dead,
    ] = await Promise.all([

      this.prisma.job.count({
        where: {
          queueId,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.QUEUED,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.CLAIMED,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.RUNNING,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.COMPLETED,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.FAILED,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.RETRYING,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.CANCELLED,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          type: JobType.SCHEDULED,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.DEAD,
        },
      }),
    ]);

    const successRate =
      totalJobs === 0
        ? 0
        : Number(
            (
              (completed /
                totalJobs) *
              100
            ).toFixed(2),
          );

    const failureRate =
      totalJobs === 0
        ? 0
        : Number(
            (
              ((failed + dead) /
                totalJobs) *
              100
            ).toFixed(2),
          );

    return {
      queue,

      statistics: {
        totalJobs,

        queued,
        claimed,
        running,

        completed,
        failed,
        retrying,
        cancelled,
        scheduled,
        dead,

        successRate,
        failureRate,
      },
    };
  }

  /**
   * Queue Metrics
   *
   * Lighter-weight snapshot than getQueueStatistics: current job
   * counts plus how many workers are assigned to the queue.
   */
  async getQueueMetrics(
    queueId: string,
  ) {
    const queue =
      await this.findById(queueId);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    const [
      totalJobs,
      queued,
      running,
      failed,
      dead,
      assignedWorkers,
    ] = await Promise.all([

      this.prisma.job.count({
        where: {
          queueId,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.QUEUED,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.RUNNING,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.FAILED,
        },
      }),

      this.prisma.job.count({
        where: {
          queueId,
          status: JobStatus.DEAD,
        },
      }),

      this.prisma.workerQueueAssignment.count({
        where: {
          queueId,
        },
      }),
    ]);

    return {
      queueId,

      totalJobs,
      queued,
      running,
      failed,
      dead,

      assignedWorkers,
    };
  }

  /**
   * Active Workers
   *
   * Workers currently assigned to the queue that are online.
   */
  async getActiveWorkers(
    queueId: string,
  ) {
    const queue =
      await this.findById(queueId);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    const assignments =
      await this.prisma.workerQueueAssignment.findMany({
        where: {
          queueId,

          worker: {
            status: WorkerStatus.ONLINE,
          },
        },

        include: {
          worker: true,
        },
      });

    return assignments.map(
      (assignment) => assignment.worker,
    );
  }

  /**
   * Recent Jobs
   */
  async getRecentJobs(
    queueId: string,
    limit = 20,
  ) {
    const queue =
      await this.findById(queueId);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    return this.prisma.job.findMany({
      where: {
        queueId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: limit,
    });
  }

  /**
   * Failed Jobs
   */
  async getFailedJobs(
    queueId: string,
    limit = 50,
  ) {
    const queue =
      await this.findById(queueId);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    return this.prisma.job.findMany({
      where: {
        queueId,
        status: JobStatus.FAILED,
      },

      orderBy: {
        failedAt: 'desc',
      },

      take: limit,
    });
  }

  /**
   * Dead Letter Jobs
   */
  async getDeadJobs(
    queueId: string,
    limit = 50,
  ) {
    const queue =
      await this.findById(queueId);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    return this.prisma.job.findMany({
      where: {
        queueId,
        status: JobStatus.DEAD,
      },

      orderBy: {
        updatedAt: 'desc',
      },

      take: limit,
    });
  }
}
