import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
  ScheduledJob,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateScheduledJobDto } from '../dto/create-scheduled-job.dto';

@Injectable()
export class ScheduledJobRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateScheduledJobDto,
  ): Promise<ScheduledJob> {
    return this.prisma.scheduledJob.create({
      data: {
        name: dto.name,
        cronExpression: dto.cronExpression,
        timezone: dto.timezone,
        enabled: dto.enabled,
        payload: dto.payload as Prisma.InputJsonValue,

        queue: {
          connect: {
            id: dto.queueId,
          },
        },
      },

      include: {
        queue: true,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<ScheduledJob | null> {
    return this.prisma.scheduledJob.findUnique({
      where: {
        id,
      },

      include: {
        queue: true,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 20,
    enabled?: boolean,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.ScheduledJobWhereInput = {};

    if (enabled !== undefined) {
      where.enabled = enabled;
    }

    const [items, total] =
      await this.prisma.$transaction([
        this.prisma.scheduledJob.findMany({
          where,

          skip,

          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            queue: true,
          },
        }),

        this.prisma.scheduledJob.count({
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
    data: Prisma.ScheduledJobUpdateInput,
  ): Promise<ScheduledJob> {
    const exists = await this.findById(id);

    if (!exists) {
      throw new NotFoundException(
        'Scheduled job not found',
      );
    }

    return this.prisma.scheduledJob.update({
      where: {
        id,
      },

      data,

      include: {
        queue: true,
      },
    });
  }

  async enable(
    id: string,
  ) {
    return this.update(id, {
      enabled: true,
    });
  }

  async disable(
    id: string,
  ) {
    return this.update(id, {
      enabled: false,
    });
  }

  async updateNextRun(
    id: string,
    nextRunAt: Date,
  ) {
    return this.update(id, {
      nextRunAt,
      lastRunAt: new Date(),
    });
  }

  async delete(
    id: string,
  ): Promise<ScheduledJob> {
    const exists = await this.findById(id);

    if (!exists) {
      throw new NotFoundException(
        'Scheduled job not found',
      );
    }

    return this.prisma.scheduledJob.delete({
      where: {
        id,
      },
    });
  }
}