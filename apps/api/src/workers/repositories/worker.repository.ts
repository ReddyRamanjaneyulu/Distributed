import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
  Worker,
  WorkerStatus,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkerDto } from '../dto/create-worker.dto';

@Injectable()
export class WorkerRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async register(
    dto: CreateWorkerDto,
  ): Promise<Worker> {
    return this.prisma.worker.create({
      data: {
        name: dto.name,
        hostname: dto.hostname,
        processId: dto.processId,
        version: dto.version,
        tags: dto.tags as Prisma.InputJsonValue,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<Worker | null> {
    return this.prisma.worker.findUnique({
      where: { id },

      include: {
        jobs: true,
        executions: true,
        heartbeats: true,
        assignments: {
          include: {
            queue: true,
          },
        },
      },
    });
  }

  async findByProcess(
    hostname: string,
    processId: number,
  ): Promise<Worker | null> {
    return this.prisma.worker.findFirst({
      where: {
        hostname,
        processId,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 20,
    status?: WorkerStatus,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.WorkerWhereInput = {};

    if (status) {
      where.status = status;
    }

    const [items, total] =
      await this.prisma.$transaction([
        this.prisma.worker.findMany({
          where,

          skip,

          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            assignments: {
              include: {
                queue: true,
              },
            },
          },
        }),

        this.prisma.worker.count({
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

  async heartbeat(
    workerId: string,
    cpuUsage?: number,
    memoryUsage?: number,
    activeJobs = 0,
    queuedJobs = 0,
  ) {
    await this.prisma.workerHeartbeat.create({
      data: {
        worker: {
          connect: {
            id: workerId,
          },
        },

        cpuUsage,
        memoryUsage,
        activeJobs,
        queuedJobs,
      },
    });

    return this.prisma.worker.update({
      where: {
        id: workerId,
      },

      data: {
        lastSeenAt: new Date(),
        status: WorkerStatus.ONLINE,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.WorkerUpdateInput,
  ) {
    const worker = await this.findById(id);

    if (!worker) {
      throw new NotFoundException(
        'Worker not found',
      );
    }

    return this.prisma.worker.update({
      where: {
        id,
      },

      data,
    });
  }

  async shutdown(
    id: string,
  ) {
    return this.update(id, {
      status: WorkerStatus.OFFLINE,
      stoppedAt: new Date(),
    });
  }

  async assignQueue(
    workerId: string,
    queueId: string,
  ) {
    return this.prisma.workerQueueAssignment.create({
      data: {
        worker: {
          connect: {
            id: workerId,
          },
        },

        queue: {
          connect: {
            id: queueId,
          },
        },
      },
    });
  }

  async removeAssignment(
    workerId: string,
    queueId: string,
  ) {
    return this.prisma.workerQueueAssignment.delete({
      where: {
        workerId_queueId: {
          workerId,
          queueId,
        },
      },
    });
  }

  async delete(
    id: string,
  ) {
    const worker = await this.findById(id);

    if (!worker) {
      throw new NotFoundException(
        'Worker not found',
      );
    }

    return this.prisma.worker.delete({
      where: {
        id,
      },
    });
  }
}