import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { QueuesModule } from '../queues';
import { RetryPoliciesModule } from '../retry-policies';

import { JobController } from './controllers/job.controller';
import { JobService } from './services/job.service';
import { JobRepository } from './repositories/job.repository';

@Module({
  imports: [
    PrismaModule,
    QueuesModule,
    RetryPoliciesModule,
  ],

  controllers: [
    JobController,
  ],

  providers: [
    JobService,
    JobRepository,
  ],

  exports: [
    JobService,
    JobRepository,
  ],
})
export class JobsModule {}