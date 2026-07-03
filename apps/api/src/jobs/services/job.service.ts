import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Job,
  JobStatus,
} from '@prisma/client';

import { JobRepository } from '../repositories/job.repository';

import {
  CreateJobDto,
  UpdateJobDto,
} from '../dto';

@Injectable()
export class JobService {
  constructor(
    private readonly repository: JobRepository,
  ) {}

  async create(
    dto: CreateJobDto,
  ): Promise<Job> {
    return this.repository.create(dto);
  }

  async findAll(
    page = 1,
    limit = 20,
    status?: JobStatus,
  ) {
    return this.repository.findAll(
      page,
      limit,
      status,
    );
  }

  async findOne(
    id: string,
  ): Promise<Job> {
    const job = await this.repository.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async update(
    id: string,
    dto: UpdateJobDto,
  ): Promise<Job> {
    return this.repository.update(id, dto);
  }

  async remove(
    id: string,
  ): Promise<Job> {
    return this.repository.delete(id);
  }

  async start(
    jobId: string,
    workerId: string,
  ) {
    return this.repository.claimJob(
      jobId,
      workerId,
    );
  }

  async complete(
    id: string,
  ) {
    return this.repository.completeJob(id);
  }

  async fail(
    id: string,
  ) {
    return this.repository.failJob(id);
  }

  async retry(
    id: string,
  ) {
    return this.repository.retryJob(id);
  }

  async cancel(
    id: string,
  ) {
    return this.repository.cancelJob(id);
  }
}