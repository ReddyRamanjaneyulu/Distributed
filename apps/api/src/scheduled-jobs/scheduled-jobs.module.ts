import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { QueuesModule } from '../queues';

import { ScheduledJobController } from './controllers/scheduled-job.controller';
import { ScheduledJobService } from './services/scheduled-job.service';
import { ScheduledJobRepository } from './repositories/scheduled-job.repository';

@Module({
  imports: [
    PrismaModule,
    QueuesModule,
  ],

  controllers: [
    ScheduledJobController,
  ],

  providers: [
    ScheduledJobRepository,
    ScheduledJobService,
  ],

  exports: [
    ScheduledJobRepository,
    ScheduledJobService,
  ],
})
export class ScheduledJobsModule {}