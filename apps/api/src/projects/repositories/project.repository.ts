import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, Project } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.ProjectCreateInput,
  ): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  async findById(
    id: string,
  ): Promise<Project | null> {
    return this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        organization: true,
      },
    });
  }

  async findByName(
    organizationId: string,
    name: string,
  ): Promise<Project | null> {
    return this.prisma.project.findFirst({
      where: {
        organizationId,
        name,
        deletedAt: null,
      },
    });
  }

  async findAll(
    organizationId: string,
    page = 1,
    limit = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      organizationId,
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
        this.prisma.project.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),

        this.prisma.project.count({
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
    data: Prisma.ProjectUpdateInput,
  ): Promise<Project> {
    const exists = await this.findById(id);

    if (!exists) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return this.prisma.project.update({
      where: {
        id,
      },
      data,
    });
  }

  async softDelete(
    id: string,
  ): Promise<Project> {
    const exists = await this.findById(id);

    if (!exists) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async exists(
    id: string,
  ): Promise<boolean> {
    const count =
      await this.prisma.project.count({
        where: {
          id,
          deletedAt: null,
        },
      });

    return count > 0;
  }
}