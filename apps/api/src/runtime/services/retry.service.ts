import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { RuntimeRepository } from '../repositories/runtime.repository';

@Injectable()
export class RetryService {
  private readonly logger = new Logger(
    RetryService.name,
  );

  constructor(
    private readonly repository: RuntimeRepository,
  ) {}

  @Cron('*/10 * * * * *')
  async processRetries() {
    const jobs =
      await this.repository.findRetryableJobs();

    for (const job of jobs) {
      await this.repository.enqueueRetry(job.id);

      this.logger.log(
        `Retry queued: ${job.id}`,
      );
    }
  }
}