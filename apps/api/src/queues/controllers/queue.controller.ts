import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { QueueService } from '../services/queue.service';

import {
  CreateQueueDto,
  UpdateQueueDto,
} from '../dto';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Queues')
@ApiBearerAuth()
@Controller('queues')

@Controller('queues')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
  ) {}

  /**
   * Create Queue
   */
  @Post()
  create(
    @Body() dto: CreateQueueDto,
  ) {
    return this.queueService.create(dto);
  }

  /**
   * List Queues
   */
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.queueService.findAll(
      Number(page),
      Number(limit),
      search,
    );
  }

  /**
   * Get Queue
   */
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.queueService.findOne(id);
  }

  /**
   * Update Queue
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQueueDto,
  ) {
    return this.queueService.update(id, dto);
  }

  /**
   * Delete Queue
   */
  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.queueService.remove(id);
  }

  /**
   * Pause Queue
   */
  @Patch(':id/pause')
  pause(
    @Param('id') id: string,
  ) {
    return this.queueService.pause(id);
  }

  /**
   * Resume Queue
   */
  @Patch(':id/resume')
  resume(
    @Param('id') id: string,
  ) {
    return this.queueService.resume(id);
  }

  /**
   * Queue Statistics
   */
  @Get(':id/statistics')
  statistics(
    @Param('id') id: string,
  ) {
    return this.queueService.statistics(id);
  }

  /**
   * Queue Metrics
   */
  @Get(':id/metrics')
  metrics(
    @Param('id') id: string,
  ) {
    return this.queueService.metrics(id);
  }

  /**
   * Queue Workers
   */
  @Get(':id/workers')
  workers(
    @Param('id') id: string,
  ) {
    return this.queueService.workers(id);
  }

  /**
   * Recent Jobs
   */
  @Get(':id/jobs')
  jobs(
    @Param('id') id: string,
    @Query('limit') limit = 20,
  ) {
    return this.queueService.jobs(
      id,
      Number(limit),
    );
  }

  /**
   * Failed Jobs
   */
  @Get(':id/failed')
  failedJobs(
    @Param('id') id: string,
    @Query('limit') limit = 50,
  ) {
    return this.queueService.failedJobs(
      id,
      Number(limit),
    );
  }

  /**
   * Dead Letter Queue Jobs
   */
  @Get(':id/dead')
  deadJobs(
    @Param('id') id: string,
    @Query('limit') limit = 50,
  ) {
    return this.queueService.deadJobs(
      id,
      Number(limit),
    );
  }
}