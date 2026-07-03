import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { JobsModule } from '../jobs';

import { WorkerController } from './controllers/worker.controller';
import { WorkerService } from './services/worker.service';
import { WorkerRepository } from './repositories/worker.repository';

@Module({
  imports: [
    PrismaModule,
    JobsModule,
  ],

  controllers: [
    WorkerController,
  ],

  providers: [
    WorkerRepository,
    WorkerService,
  ],

  exports: [
    WorkerRepository,
    WorkerService,
  ],
})
export class WorkersModule {}