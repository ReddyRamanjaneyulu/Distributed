import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Worker,
  WorkerStatus,
} from '@prisma/client';

import { WorkerRepository } from '../repositories/worker.repository';

import {
  CreateWorkerDto,
  UpdateWorkerDto,
} from '../dto';

@Injectable()
export class WorkerService {
  constructor(
    private readonly repository: WorkerRepository,
  ) {}

  async register(
    dto: CreateWorkerDto,
  ): Promise<Worker> {
    const existing =
      await this.repository.findByProcess(
        dto.hostname,
        dto.processId,
      );

    if (existing) {
      return existing;
    }

    return this.repository.register(dto);
  }

  async findAll(
    page = 1,
    limit = 20,
    status?: WorkerStatus,
  ) {
    return this.repository.findAll(
      page,
      limit,
      status,
    );
  }

  async findOne(
    id: string,
  ): Promise<Worker> {
    const worker =
      await this.repository.findById(id);

    if (!worker) {
      throw new NotFoundException(
        'Worker not found',
      );
    }

    return worker;
  }

  
  async update(
    id: string,
    dto: UpdateWorkerDto,
  ) {
    return this.repository.update(
      id,
      dto,
    );
  }

  async shutdown(
    id: string,
  ) {
    return this.repository.shutdown(id);
  }

  async assignQueue(
    workerId: string,
    queueId: string,
  ) {
    return this.repository.assignQueue(
      workerId,
      queueId,
    );
  }

  async removeQueue(
    workerId: string,
    queueId: string,
  ) {
    return this.repository.removeAssignment(
      workerId,
      queueId,
    );
  }

  async remove(
    id: string,
  ) {
    return this.repository.delete(id);
  }
  async heartbeat(
  workerId: string,
  cpuUsage: number,
  memoryUsage: number,
  activeJobs: number,
  queuedJobs: number,
) {
  return this.repository.heartbeat(
    workerId,
    cpuUsage,
    memoryUsage,
    activeJobs,
    queuedJobs,
  );
}
}