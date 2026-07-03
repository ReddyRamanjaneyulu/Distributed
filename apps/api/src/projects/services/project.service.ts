import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Project } from '@prisma/client';

import { OrganizationService } from '../../organizations/services/organization.service';

import { ProjectRepository } from '../repositories/project.repository';

import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly organizationService: OrganizationService,
  ) {}

  async create(
    dto: CreateProjectDto,
  ): Promise<Project> {
    const organizationExists =
      await this.organizationService.exists(
        dto.organizationId,
      );

    if (!organizationExists) {
      throw new NotFoundException(
        'Organization not found',
      );
    }

    const duplicate =
      await this.projectRepository.findByName(
        dto.organizationId,
        dto.name,
      );

    if (duplicate) {
      throw new ConflictException(
        'Project name already exists',
      );
    }

    return this.projectRepository.create({
      name: dto.name,
      description: dto.description,

      organization: {
        connect: {
          id: dto.organizationId,
        },
      },
    });
  }

  async findAll(
    organizationId: string,
    page = 1,
    limit = 10,
    search?: string,
  ) {
    return this.projectRepository.findAll(
      organizationId,
      page,
      limit,
      search,
    );
  }

  async findOne(
    id: string,
  ): Promise<Project> {
    const project =
      await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project =
      await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    if (dto.name) {
      const duplicate =
        await this.projectRepository.findByName(
          project.organizationId,
          dto.name,
        );

      if (
        duplicate &&
        duplicate.id !== project.id
      ) {
        throw new ConflictException(
          'Project name already exists',
        );
      }
    }

    return this.projectRepository.update(
      id,
      dto,
    );
  }

  async remove(
    id: string,
  ): Promise<Project> {
    return this.projectRepository.softDelete(id);
  }

  async exists(
    id: string,
  ): Promise<boolean> {
    return this.projectRepository.exists(id);
  }
}