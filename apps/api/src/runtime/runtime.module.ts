import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from '../prisma/prisma.module';
import { ExecutionModule } from '../execution';

import { RuntimeRepository } from './repositories/runtime.repository';

import { DispatcherService } from './services/dispatcher.service';
import { RetryService } from './services/retry.service';
import { SchedulerService } from './services/scheduler.service';
import { RuntimeService } from './services/runtime.service';
import { WorkerMonitorService } from './services/worker-monitor.service'; // or ../workers/services/... depending on where you created it

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
    RuntimeService,
    WorkerMonitorService,
  ],
  exports: [
    RuntimeRepository,
    RuntimeService,
  ],
})
export class RuntimeModule {}