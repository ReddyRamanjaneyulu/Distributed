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

  async update(
    id: string,
    dto: UpdateQueueDto,
  ): Promise<Queue> {
    return this.repository.update(id, dto);
  }

  async remove(
    id: string,
  ): Promise<Queue> {
    return this.repository.delete(id);
  }
}