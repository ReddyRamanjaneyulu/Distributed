import { Project } from '@prisma/client';

export class ProjectEntity implements Project {
  id: string;

  name: string;

  description: string | null;

  organizationId: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}