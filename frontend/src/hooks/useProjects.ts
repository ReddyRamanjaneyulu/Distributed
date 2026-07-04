import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { projectsApi } from '../api/projects';
import { extractErrorMessage } from '../api/axios';

import type {
  CreateProjectPayload,
  PaginationParams,
  UpdateProjectPayload,
} from '../types';

const PROJECTS_KEY = 'projects';

export function useProjects(params: PaginationParams) {
  return useQuery({
    queryKey: [PROJECTS_KEY, params],
    queryFn: () => projectsApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: [PROJECTS_KEY, id],
    queryFn: () => projectsApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectsApi.create(payload),
    onSuccess: () => {
      toast.success('Project created');
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProjectPayload }) =>
      projectsApi.update(id, payload),
    onSuccess: () => {
      toast.success('Project updated');
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => {
      toast.success('Project deleted');
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
