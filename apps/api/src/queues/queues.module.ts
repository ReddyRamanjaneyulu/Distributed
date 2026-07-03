import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ProjectsModule } from '../projects';
import { RetryPoliciesModule } from '../retry-policies';

import { QueueController } from './controllers/queue.controller';
import { QueueService } from './services/queue.service';
import { QueueRepository } from './repositories/queue.repository';

@Module({
  imports: [
    PrismaModule,
    ProjectsModule,
    RetryPoliciesModule,
  ],

  controllers: [
    QueueController,
  ],

  providers: [
    QueueService,
    QueueRepository,
  ],

  exports: [
    QueueService,
    QueueRepository,
  ],
})
export class QueuesModule {}