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

@Controller('queues')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateQueueDto,
  ) {
    return this.queueService.create(dto);
  }

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

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.queueService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQueueDto,
  ) {
    return this.queueService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.queueService.remove(id);
  }
}