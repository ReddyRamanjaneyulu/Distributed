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
import { HealthModule } from './health/health.module';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, databaseConfig],
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
    HealthModule,
  ],
})
export class AppModule {}