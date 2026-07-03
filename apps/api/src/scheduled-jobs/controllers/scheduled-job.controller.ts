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

import { ScheduledJobService } from '../services/scheduled-job.service';

import {
  CreateScheduledJobDto,
  UpdateScheduledJobDto,
} from '../dto';

@Controller('scheduled-jobs')
@UseGuards(JwtAuthGuard)
export class ScheduledJobController {
  constructor(
    private readonly service: ScheduledJobService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateScheduledJobDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('enabled') enabled?: boolean,
  ) {
    return this.service.findAll(
      Number(page),
      Number(limit),
      enabled,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateScheduledJobDto,
  ) {
    return this.service.update(
      id,
      dto,
    );
  }

  @Patch(':id/enable')
  enable(
    @Param('id') id: string,
  ) {
    return this.service.enable(id);
  }

  @Patch(':id/disable')
  disable(
    @Param('id') id: string,
  ) {
    return this.service.disable(id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.service.remove(id);
  }
}