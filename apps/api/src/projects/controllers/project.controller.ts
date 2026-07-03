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

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

import { ProjectService } from '../services/project.service';

import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Project',
  })
  @ApiResponse({
    status: 201,
    type: ProjectResponseDto,
  })
  async create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: any,
  ) {
    // owner validation will be added later
    return this.projectService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List Projects',
  })
  @ApiQuery({
    name: 'organizationId',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  async findAll(
    @Query('organizationId') organizationId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.projectService.findAll(
      organizationId,
      Number(page),
      Number(limit),
      search,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Project',
  })
  async findOne(
    @Param('id') id: string,
  ) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Project',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Project',
  })
  async remove(
    @Param('id') id: string,
  ) {
    return this.projectService.remove(id);
  }
}