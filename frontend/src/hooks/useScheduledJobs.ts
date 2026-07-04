import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { scheduledJobsApi } from '../api/scheduledJobs';
import { extractErrorMessage } from '../api/axios';

import type {
  CreateScheduledJobPayload,
  PaginationParams,
  UpdateScheduledJobPayload,
} from '../types';

const SCHEDULED_JOBS_KEY = 'scheduled-jobs';

export function useScheduledJobs(params: PaginationParams) {
  return useQuery({
    queryKey: [SCHEDULED_JOBS_KEY, params],
    queryFn: () => scheduledJobsApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreateScheduledJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateScheduledJobPayload) => scheduledJobsApi.create(payload),
    onSuccess: () => {
      toast.success('Scheduled job created');
      queryClient.invalidateQueries({ queryKey: [SCHEDULED_JOBS_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateScheduledJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateScheduledJobPayload }) =>
      scheduledJobsApi.update(id, payload),
    onSuccess: () => {
      toast.success('Scheduled job updated');
      queryClient.invalidateQueries({ queryKey: [SCHEDULED_JOBS_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useToggleScheduledJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      scheduledJobsApi.toggle(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULED_JOBS_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteScheduledJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduledJobsApi.remove(id),
    onSuccess: () => {
      toast.success('Scheduled job deleted');
      queryClient.invalidateQueries({ queryKey: [SCHEDULED_JOBS_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
