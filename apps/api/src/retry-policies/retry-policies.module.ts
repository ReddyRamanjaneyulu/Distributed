import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { RetryPolicyController } from './controllers/etry-policy.controller';
import { RetryPolicyService } from './services/retry-policy.service';
import { RetryPolicyRepository } from './repositories/retry-policy.repository';

@Module({
  imports: [PrismaModule],

  controllers: [RetryPolicyController],

  providers: [
    RetryPolicyService,
    RetryPolicyRepository,
  ],

  exports: [
    RetryPolicyService,
    RetryPolicyRepository,
  ],
})
export class RetryPoliciesModule {}