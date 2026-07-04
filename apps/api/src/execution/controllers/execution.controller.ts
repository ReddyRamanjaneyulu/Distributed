import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { ExecutionService } from '../services/execution.service';

import {
  ExecuteJobDto,
  FailJobDto,
} from '../dto';

@Controller('execution')
@UseGuards(JwtAuthGuard)
export class ExecutionController {
  constructor(
    private readonly executionService: ExecutionService,
  ) {}

  /**
   * Worker polls for next job
   */
  @Post('poll')
  poll(
    @Body('queueId') queueId: string,
    @Body('workerId') workerId: string,
  ) {
    return this.executionService.poll(
      queueId,
      workerId,
    );
  }

  /**
   * Complete execution
   */
  @Post(':executionId/complete')
  complete(
    @Param('executionId') executionId: string,
    @Body() _dto: ExecuteJobDto,
  ) {
    return this.executionService.complete(
      executionId,
    );
  }

  /**
   * Fail execution
   */
  @Post(':executionId/fail')
  fail(
    @Param('executionId') executionId: string,
    @Body() dto: FailJobDto,
  ) {
    return this.executionService.fail(
      executionId,
      dto.message ?? 'Unknown error',
    );
  }

  /**
   * Retry execution
   */
  @Post(':executionId/retry')
retry(
  @Param('executionId') executionId: string,
) {
  return this.executionService.retry(
    executionId,
  );
}
  /**
   * Cancel execution
   */
  @Post(':executionId/cancel')
  cancel(
    @Param('executionId') executionId: string,
  ) {
    return this.executionService.cancel(
      executionId,
    );
  }
}