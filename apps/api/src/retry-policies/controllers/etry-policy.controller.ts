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

import { RetryPolicyService } from '../services/retry-policy.service';

import { CreateRetryPolicyDto } from '../dto/create-retry-policy.dto';
import { UpdateRetryPolicyDto } from '../dto/update-retry-policy.dto';

@Controller('retry-policies')
@UseGuards(JwtAuthGuard)
export class RetryPolicyController {
  constructor(
    private readonly retryPolicyService: RetryPolicyService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateRetryPolicyDto,
  ) {
    return this.retryPolicyService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.retryPolicyService.findAll(
      Number(page),
      Number(limit),
      search,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.retryPolicyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRetryPolicyDto,
  ) {
    return this.retryPolicyService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.retryPolicyService.remove(id);
  }
}