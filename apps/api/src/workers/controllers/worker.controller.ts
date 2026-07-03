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

import { WorkerStatus } from '@prisma/client';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { WorkerService } from '../services/worker.service';

import {
  CreateWorkerDto,
  UpdateWorkerDto,
  WorkerHeartbeatDto,
} from '../dto';

@Controller('workers')
@UseGuards(JwtAuthGuard)
export class WorkerController {
  constructor(
    private readonly workerService: WorkerService,
  ) {}

  @Post('register')
  register(
    @Body() dto: CreateWorkerDto,
  ) {
    return this.workerService.register(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: WorkerStatus,
  ) {
    return this.workerService.findAll(
      Number(page),
      Number(limit),
      status,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.workerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.workerService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.workerService.remove(id);
  }

  @Post(':id/heartbeat')
  heartbeat(
    @Param('id') id: string,
    @Body() dto: WorkerHeartbeatDto,
  ) {
    return this.workerService.heartbeat(
      id,
      dto.cpuUsage,
      dto.memoryUsage,
      dto.activeJobs,
      dto.queuedJobs,
    );
  }

  @Post(':id/shutdown')
  shutdown(
    @Param('id') id: string,
  ) {
    return this.workerService.shutdown(id);
  }

  @Post(':id/assign/:queueId')
  assignQueue(
    @Param('id') workerId: string,
    @Param('queueId') queueId: string,
  ) {
    return this.workerService.assignQueue(
      workerId,
      queueId,
    );
  }

  @Delete(':id/assign/:queueId')
  removeQueue(
    @Param('id') workerId: string,
    @Param('queueId') queueId: string,
  ) {
    return this.workerService.removeQueue(
      workerId,
      queueId,
    );
  }
}