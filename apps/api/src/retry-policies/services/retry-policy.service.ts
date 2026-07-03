import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RetryPolicy } from '@prisma/client';

import { RetryPolicyRepository } from '../repositories/retry-policy.repository';
import { CreateRetryPolicyDto } from '../dto/create-retry-policy.dto';
import { UpdateRetryPolicyDto } from '../dto/update-retry-policy.dto';

@Injectable()
export class RetryPolicyService {
  constructor(
    private readonly repository: RetryPolicyRepository,
  ) {}

  async create(
    dto: CreateRetryPolicyDto,
  ): Promise<RetryPolicy> {
    const exists = await this.repository.findByName(dto.name);

    if (exists) {
      throw new ConflictException(
        'Retry policy already exists',
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
  ): Promise<RetryPolicy> {
    const retryPolicy =
      await this.repository.findById(id);

    if (!retryPolicy) {
      throw new NotFoundException(
        'Retry policy not found',
      );
    }

    return retryPolicy;
  }

  async update(
    id: string,
    dto: UpdateRetryPolicyDto,
  ): Promise<RetryPolicy> {
    return this.repository.update(id, dto);
  }

  async remove(
    id: string,
  ): Promise<RetryPolicy> {
    return this.repository.delete(id);
  }
}