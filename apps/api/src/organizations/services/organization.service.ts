import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Organization } from '@prisma/client';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '../dto';

import { OrganizationRepository } from '../repositories/organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async create(
    dto: CreateOrganizationDto,
  ): Promise<Organization> {
    const existing =
      await this.organizationRepository.findByName(dto.name);

    if (existing) {
      throw new ConflictException(
        'Organization name already exists',
      );
    }

    return this.organizationRepository.create({
      name: dto.name,
      description: dto.description,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    return this.organizationRepository.findAll(
      page,
      limit,
      search,
    );
  }

  async findOne(
    id: string,
  ): Promise<Organization> {
    const organization =
      await this.organizationRepository.findById(id);

    if (!organization) {
      throw new NotFoundException(
        'Organization not found',
      );
    }

    return organization;
  }

  async update(
    id: string,
    dto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization =
      await this.organizationRepository.findById(id);

    if (!organization) {
      throw new NotFoundException(
        'Organization not found',
      );
    }

    if (dto.name) {
      const duplicate =
        await this.organizationRepository.findByName(
          dto.name,
        );

      if (
        duplicate &&
        duplicate.id !== organization.id
      ) {
        throw new ConflictException(
          'Organization name already exists',
        );
      }
    }

    return this.organizationRepository.update(
      id,
      dto,
    );
  }

  async remove(
    id: string,
  ): Promise<Organization> {
    return this.organizationRepository.softDelete(id);
  }

  async exists(
    id: string,
  ): Promise<boolean> {
    return this.organizationRepository.exists(id);
  }
}