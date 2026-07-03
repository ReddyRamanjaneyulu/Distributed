import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { RuntimeRepository } from '../repositories/runtime.repository';

@Injectable()
export class DispatcherService {
  private readonly logger =
    new Logger(DispatcherService.name);

  constructor(
    private readonly repository: RuntimeRepository,
  ) {}

  @Cron('*/5 * * * * *')
  async dispatch() {
    const jobs =
      await this.repository.findRunnableJobs();

    for (const job of jobs) {
      const workers =
        await this.repository.findAvailableWorkers(
          job.queueId,
        );

      if (!workers.length) {
        continue;
      }

      const worker = workers[0];

const claimed =
  await this.repository.claimJob(
    job.id,
    worker.id,
  );

if (!claimed) {
  continue;
}

this.logger.log(
  `Claimed Job ${claimed.job.id} -> Worker ${worker.name}`,
);

      // Next step:
      // Atomically claim the job
      // Create JobExecution
      // Assign worker
      // Notify worker
    }
  }
}