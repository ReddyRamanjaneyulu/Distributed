import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations';
import { ProjectsModule } from './projects';
import { RetryPoliciesModule } from './retry-policies';
import { QueuesModule } from './queues';
import { JobsModule } from './jobs';
import { WorkersModule } from './workers';
import { ScheduledJobsModule } from './scheduled-jobs';
import { ExecutionModule } from './execution';
import { RuntimeModule } from './runtime';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    OrganizationsModule,
    ProjectsModule,
    RetryPoliciesModule,
    QueuesModule,
    JobsModule,
    WorkersModule,
    ScheduledJobsModule,
    ExecutionModule,
    RuntimeModule,
  ],
})
export class AppModule {}