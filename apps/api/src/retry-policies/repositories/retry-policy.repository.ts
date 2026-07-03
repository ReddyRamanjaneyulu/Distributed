import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RetryPolicy } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RetryPolicyRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.RetryPolicyCreateInput,
  ): Promise<RetryPolicy> {
    return this.prisma.retryPolicy.create({
      data,
    });
  }

  async findById(
    id: string,
  ): Promise<RetryPolicy | null> {
    return this.prisma.retryPolicy.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(
    name: string,
  ): Promise<RetryPolicy | null> {
    return this.prisma.retryPolicy.findFirst({
      where: {
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

    const where: Prisma.RetryPolicyWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.retryPolicy.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.retryPolicy.count({
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
    data: Prisma.RetryPolicyUpdateInput,
  ): Promise<RetryPolicy> {
    const retryPolicy = await this.findById(id);

    if (!retryPolicy) {
      throw new NotFoundException(
        'Retry policy not found',
      );
    }

    return this.prisma.retryPolicy.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(
    id: string,
  ): Promise<RetryPolicy> {
    const retryPolicy = await this.findById(id);

    if (!retryPolicy) {
      throw new NotFoundException(
        'Retry policy not found',
      );
    }

    return this.prisma.retryPolicy.delete({
      where: {
        id,
      },
    });
  }

  async exists(
    id: string,
  ): Promise<boolean> {
    const count = await this.prisma.retryPolicy.count({
      where: {
        id,
      },
    });

    return count > 0;
  }
}