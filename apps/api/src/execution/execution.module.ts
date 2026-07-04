import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { ExecutionController } from './controllers/execution.controller';
import { ExecutionService } from './services/execution.service';
import { ExecutionRepository } from './repositories/execution.repository';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    ExecutionController,
  ],
  providers: [
    ExecutionService,
    ExecutionRepository,
  ],
  exports: [
    ExecutionService,
    ExecutionRepository,
  ],
})
export class ExecutionModule {}