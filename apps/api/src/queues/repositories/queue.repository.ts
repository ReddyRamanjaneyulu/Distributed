import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Queue } from '@prisma/client';

import { CreateQueueDto } from '../dto/create-queue.dto';

@Injectable()
export class QueueRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateQueueDto): Promise<Queue> {
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

  async findById(
    id: string,
  ): Promise<Queue | null> {
    return this.prisma.queue.findUnique({
      where: { id },
      include: {
        project: true,
        retryPolicy: true,
        deadLetterQueue: true,
      },
    });
  }

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

    const [items, total] = await this.prisma.$transaction([
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
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    data: Prisma.QueueUpdateInput,
  ): Promise<Queue> {
    const queue = await this.findById(id);

    if (!queue) {
      throw new NotFoundException('Queue not found');
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

  async delete(
    id: string,
  ): Promise<Queue> {
    const queue = await this.findById(id);

    if (!queue) {
      throw new NotFoundException('Queue not found');
    }

    return this.prisma.queue.delete({
      where: {
        id,
      },
    });
  }

  async exists(
    id: string,
  ): Promise<boolean> {
    const count = await this.prisma.queue.count({
      where: {
        id,
      },
    });

    return count > 0;
  }
}