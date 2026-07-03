import { PartialType } from '@nestjs/mapped-types';
import { CreateRetryPolicyDto } from './create-retry-policy.dto';

export class UpdateRetryPolicyDto extends PartialType(
  CreateRetryPolicyDto,
) {}