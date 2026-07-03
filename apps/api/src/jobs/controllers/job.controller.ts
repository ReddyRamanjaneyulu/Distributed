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

import { JobStatus } from '@prisma/client';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { JobService } from '../services/job.service';

import {
  CreateJobDto,
  UpdateJobDto,
} from '../dto';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobController {
  constructor(
    private readonly jobService: JobService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateJobDto,
  ) {
    return this.jobService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: JobStatus,
  ) {
    return this.jobService.findAll(
      Number(page),
      Number(limit),
      status,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.jobService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.jobService.remove(id);
  }

  @Post(':id/start')
  start(
    @Param('id') id: string,
    @Body('workerId') workerId: string,
  ) {
    return this.jobService.start(id, workerId);
  }

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
  ) {
    return this.jobService.complete(id);
  }

  @Post(':id/fail')
  fail(
    @Param('id') id: string,
  ) {
    return this.jobService.fail(id);
  }

  @Post(':id/retry')
  retry(
    @Param('id') id: string,
  ) {
    return this.jobService.retry(id);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
  ) {
    return this.jobService.cancel(id);
  }
}