import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CronExpressionParser } from 'cron-parser';

import { RuntimeRepository } from '../repositories/runtime.repository';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(
    SchedulerService.name,
  );

  constructor(
    private readonly repository: RuntimeRepository,
  ) {}

  @Cron('* * * * *')
  async schedule() {
    const jobs =
      await this.repository.findDueSchedules();

    for (const scheduled of jobs) {
      await this.repository.enqueueScheduledJob(
        scheduled.id,
      );

      const interval =
        CronExpressionParser.parse(
          scheduled.cronExpression,
        );

      const next =
        interval.next().toDate();

      await this.repository.updateScheduleNextRun(
        scheduled.id,
        next,
      );

      this.logger.log(
        `Scheduled job ${scheduled.id} queued`,
      );
    }
  }
}