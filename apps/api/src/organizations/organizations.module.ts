import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { OrganizationController } from './controllers/organization.controller';
import { OrganizationService } from './services/organization.service';
import { OrganizationRepository } from './repositories/organization.repository';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationRepository,
  ],
  exports: [
    OrganizationService,
    OrganizationRepository,
  ],
})
export class OrganizationsModule {}