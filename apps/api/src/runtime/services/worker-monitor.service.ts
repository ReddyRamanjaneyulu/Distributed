import {
  Injectable,
} from '@nestjs/common';

import {
  Cron,
  CronExpression,
} from '@nestjs/schedule';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkerMonitorService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async monitor() {

    const timeout =
      new Date(
        Date.now() - 60000,
      );

    await this.prisma.worker.updateMany({
      where: {
        lastSeenAt: {
          lt: timeout,
        },
      },

      data: {
        status: 'OFFLINE',
      },
    });
  }
}