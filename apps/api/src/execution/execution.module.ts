import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { JobsModule } from '../jobs';
import { WorkersModule } from '../workers';
import { QueuesModule } from '../queues';

import { ExecutionController } from './controllers/execution.controller';
import { ExecutionRepository } from './repositories/execution.repository';
import { ExecutionService } from './services/execution.service';

@Module({
  imports: [
    PrismaModule,
    JobsModule,
    WorkersModule,
    QueuesModule,
  ],

  controllers: [
    ExecutionController,
  ],

  providers: [
    ExecutionRepository,
    ExecutionService,
  ],

  exports: [
    ExecutionRepository,
    ExecutionService,
  ],
})
export class ExecutionModule {}