import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { OrganizationsModule } from '../organizations';
import { AuthModule } from '../auth/auth.module';

import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { ProjectRepository } from './repositories/project.repository';

@Module({
  imports: [
    PrismaModule,
    OrganizationsModule,
    AuthModule, // <-- Add this
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository,
  ],
  exports: [
    ProjectService,
    ProjectRepository,
  ],
})
export class ProjectsModule {}