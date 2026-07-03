import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Organization } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrganizationRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.OrganizationCreateInput,
  ): Promise<Organization> {
    return this.prisma.organization.create({
      data,
    });
  }

  async findById(
    id: string,
  ): Promise<Organization | null> {
    return this.prisma.organization.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByName(
    name: string,
  ): Promise<Organization | null> {
    return this.prisma.organization.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.OrganizationWhereInput = {
      deletedAt: null,

      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [items, total] =
      await this.prisma.$transaction([
        this.prisma.organization.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),

        this.prisma.organization.count({
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
    data: Prisma.OrganizationUpdateInput,
  ): Promise<Organization> {
    const exists = await this.findById(id);

    if (!exists) {
      throw new NotFoundException(
        'Organization not found',
      );
    }

    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async softDelete(
    id: string,
  ): Promise<Organization> {
    const exists = await this.findById(id);

    if (!exists) {
      throw new NotFoundException(
        'Organization not found',
      );
    }

    return this.prisma.organization.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async exists(
    id: string,
  ): Promise<boolean> {
    const count =
      await this.prisma.organization.count({
        where: {
          id,
          deletedAt: null,
        },
      });

    return count > 0;
  }
}