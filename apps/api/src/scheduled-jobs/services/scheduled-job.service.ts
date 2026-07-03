import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ScheduledJob } from '@prisma/client';

import { ScheduledJobRepository } from '../repositories/scheduled-job.repository';

import {
  CreateScheduledJobDto,
  UpdateScheduledJobDto,
} from '../dto';

@Injectable()
export class ScheduledJobService {
  constructor(
    private readonly repository: ScheduledJobRepository,
  ) {}

  async create(
    dto: CreateScheduledJobDto,
  ): Promise<ScheduledJob> {
    return this.repository.create(dto);
  }

  async findAll(
    page = 1,
    limit = 20,
    enabled?: boolean,
  ) {
    return this.repository.findAll(
      page,
      limit,
      enabled,
    );
  }

  async findOne(
    id: string,
  ): Promise<ScheduledJob> {
    const job = await this.repository.findById(id);

    if (!job) {
      throw new NotFoundException(
        'Scheduled job not found',
      );
    }

    return job;
  }

  async update(
    id: string,
    dto: UpdateScheduledJobDto,
  ): Promise<ScheduledJob> {
    return this.repository.update(
      id,
      dto,
    );
  }

  async enable(
    id: string,
  ) {
    return this.repository.enable(id);
  }

  async disable(
    id: string,
  ) {
    return this.repository.disable(id);
  }

  async remove(
    id: string,
  ) {
    return this.repository.delete(id);
  }
}