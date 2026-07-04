import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Queue } from '@prisma/client';

import { QueueRepository } from '../repositories/queue.repository';

import { CreateQueueDto } from '../dto/create-queue.dto';
import { UpdateQueueDto } from '../dto/update-queue.dto';

@Injectable()
export class QueueService {
  constructor(
    private readonly repository: QueueRepository,
  ) {}

  /**
   * Create Queue
   */
  async create(
    dto: CreateQueueDto,
  ): Promise<Queue> {
    const exists =
      await this.repository.findByName(
        dto.projectId,
        dto.name,
      );

    if (exists) {
      throw new ConflictException(
        'Queue already exists',
      );
    }

    return this.repository.create(dto);
  }

  /**
   * List Queues
   */
  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    return this.repository.findAll(
      page,
      limit,
      search,
    );
  }

  /**
   * Find Queue
   */
  async findOne(
    id: string,
  ): Promise<Queue> {
    const queue =
      await this.repository.findById(id);

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      );
    }

    return queue;
  }

  /**
   * Update Queue
   */
  async update(
    id: string,
    dto: UpdateQueueDto,
  ): Promise<Queue> {
    return this.repository.update(
      id,
      dto,
    );
  }

  /**
   * Delete Queue
   */
  async remove(
    id: string,
  ): Promise<Queue> {
    return this.repository.delete(id);
  }

  /**
   * Pause Queue
   */
  async pause(
    id: string,
  ) {
    return this.repository.pauseQueue(id);
  }

  /**
   * Resume Queue
   */
  async resume(
    id: string,
  ) {
    return this.repository.resumeQueue(id);
  }

  /**
   * Queue Statistics
   */
  async statistics(
    id: string,
  ) {
    return this.repository.getQueueStatistics(
      id,
    );
  }

  /**
   * Queue Metrics
   */
  async metrics(
    id: string,
  ) {
    return this.repository.getQueueMetrics(
      id,
    );
  }

  /**
   * Active Workers
   */
  async workers(
    id: string,
  ) {
    return this.repository.getActiveWorkers(
      id,
    );
  }

  /**
   * Recent Jobs
   */
  async jobs(
    id: string,
    limit = 20,
  ) {
    return this.repository.getRecentJobs(
      id,
      limit,
    );
  }

  /**
   * Failed Jobs
   */
  async failedJobs(
    id: string,
    limit = 50,
  ) {
    return this.repository.getFailedJobs(
      id,
      limit,
    );
  }

  /**
   * Dead Letter Jobs
   */
  async deadJobs(
    id: string,
    limit = 50,
  ) {
    return this.repository.getDeadJobs(
      id,
      limit,
    );
  }
}