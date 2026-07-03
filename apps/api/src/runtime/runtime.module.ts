import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from '../prisma/prisma.module';
import { ExecutionModule } from '../execution';

import { RuntimeRepository } from './repositories/runtime.repository';

import { DispatcherService } from './services/dispatcher.service';
import { RetryService } from './services/retry.service';
import { SchedulerService } from './services/scheduler.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    ExecutionModule,
  ],
  providers: [
    RuntimeRepository,
    DispatcherService,
    RetryService,
    SchedulerService,
  ],
  exports: [
    RuntimeRepository,
  ],
})
export class RuntimeModule {}