export interface Organization {
  id: string;
  name: string;
  description?: string | null;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  organization?: Organization;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  organizationId: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
}
