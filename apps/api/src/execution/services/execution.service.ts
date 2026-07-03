import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LogLevel } from '@prisma/client';

import { ExecutionRepository } from '../repositories/execution.repository';

@Injectable()
export class ExecutionService {
  constructor(
    private readonly repository: ExecutionRepository,
  ) {}

  async poll(
    queueId: string,
    workerId: string,
  ) {
    const job = await this.repository.poll(queueId);

    if (!job) {
      return null;
    }

    await this.repository.claim(
      job.id,
      workerId,
    );

    const execution =
      await this.repository.createExecution(
        job.id,
        workerId,
      );

    return {
      executionId: execution.id,
      job,
    };
  }

  async complete(
    executionId: string,
  ) {
    const execution =
      await this.repository.findExecution(
        executionId,
      );

    if (!execution) {
      throw new NotFoundException(
        'Execution not found',
      );
    }

    await this.repository.completeExecution(
      executionId,
    );

    await this.repository.completeJob(
      execution.jobId,
    );

    if (execution.workerId) {
      await this.repository.releaseWorker(
        execution.workerId,
      );
    }

    await this.repository.createLog(
      execution.jobId,
      executionId,
      LogLevel.INFO,
      'Job completed successfully',
    );

    return {
      success: true,
    };
  }

  async fail(
    executionId: string,
    message: string,
  ) {
    const execution =
      await this.repository.findExecution(
        executionId,
      );

    if (!execution) {
      throw new NotFoundException(
        'Execution not found',
      );
    }

    await this.repository.failExecution(
      executionId,
      message,
    );

    await this.repository.failJob(
      execution.jobId,
    );

    if (execution.workerId) {
      await this.repository.releaseWorker(
        execution.workerId,
      );
    }

    await this.repository.createLog(
      execution.jobId,
      executionId,
      LogLevel.ERROR,
      message,
    );

    return {
      success: true,
    };
  }

  async retry(
    executionId: string,
    nextRun: Date,
  ) {
    const execution =
      await this.repository.findExecution(
        executionId,
      );

    if (!execution) {
      throw new NotFoundException(
        'Execution not found',
      );
    }

    return this.repository.retryJob(
      execution.jobId,
      nextRun,
    );
  }

  async cancel(
    executionId: string,
  ) {
    const execution =
      await this.repository.findExecution(
        executionId,
      );

    if (!execution) {
      throw new NotFoundException(
        'Execution not found',
      );
    }

    return this.repository.cancelJob(
      execution.jobId,
    );
  }
}