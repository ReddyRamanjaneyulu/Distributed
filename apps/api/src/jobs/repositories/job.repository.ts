import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Job,
  JobStatus,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateJobDto } from '../dto/create-job.dto';

@Injectable()
export class JobRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateJobDto): Promise<Job> {
    return this.prisma.job.create({
      data: {
        type: dto.type,
        payload: dto.payload,
        priority: dto.priority,
        retryStrategy: dto.retryStrategy,
        maxAttempts: dto.maxAttempts,
        baseDelayMs: dto.baseDelayMs,
        scheduledAt: dto.scheduledAt,
        availableAt: dto.availableAt,

        queue: {
          connect: {
            id: dto.queueId,
          },
        },

        ...(dto.batchId && {
          batch: {
            connect: {
              id: dto.batchId,
            },
          },
        }),
      },

      include: {
        queue: true,
        batch: true,
        worker: true,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<Job | null> {
    return this.prisma.job.findUnique({
      where: {
        id,
      },

      include: {
        queue: true,
        batch: true,
        worker: true,
        executions: true,
        logs: true,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 20,
    status?: JobStatus,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {};

    if (status) {
      where.status = status;
    }

    const [items, total] =
      await this.prisma.$transaction([
        this.prisma.job.findMany({
          where,

          skip,

          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            queue: true,
            worker: true,
            batch: true,
          },
        }),

        this.prisma.job.count({
          where,
        }),
      ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    data: Prisma.JobUpdateInput,
  ): Promise<Job> {
    const exists = await this.findById(id);

    if (!exists) {
      throw new NotFoundException(
        'Job not found',
      );
    }

    return this.prisma.job.update({
      where: {
        id,
      },

      data,

      include: {
        queue: true,
        worker: true,
        batch: true,
      },
    });
  }

  async updateStatus(
    id: string,
    status: JobStatus,
  ) {
    return this.update(id, {
      status,
    });
  }

  async claimJob(
    jobId: string,
    workerId: string,
  ) {
    return this.prisma.job.update({
      where: {
        id: jobId,
      },

      data: {
        status: JobStatus.RUNNING,

        worker: {
          connect: {
            id: workerId,
          },
        },

        startedAt: new Date(),
      },
    });
  }

  async completeJob(
    id: string,
  ) {
    return this.prisma.job.update({
      where: {
        id,
      },

      data: {
        status: JobStatus.COMPLETED,

        completedAt: new Date(),
      },
    });
  }

  async failJob(
    id: string,
  ) {
    return this.prisma.job.update({
      where: {
        id,
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

  async retryJob(
    id: string,
  ) {
    return this.prisma.job.update({
      where: {
        id,
      },

      data: {
        status: JobStatus.RETRYING,

        availableAt: new Date(),
      },
    });
  }

  async cancelJob(
    id: string,
  ) {
    return this.prisma.job.update({
      where: {
        id,
      },

      data: {
        status: JobStatus.CANCELLED,

        cancelledAt: new Date(),
      },
    });
  }

  async delete(
    id: string,
  ): Promise<Job> {
    const exists = await this.findById(id);

    if (!exists) {
      throw new NotFoundException(
        'Job not found',
      );
    }

    return this.prisma.job.delete({
      where: {
        id,
      },
    });
  }
}