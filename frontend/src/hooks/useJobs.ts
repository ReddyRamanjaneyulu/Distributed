import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { jobsApi } from '../api/jobs';
import { extractErrorMessage } from '../api/axios';

import type { JobFilters } from '../types';

const JOBS_KEY = 'jobs';

export function useJobs(filters: JobFilters) {
  return useQuery({
    queryKey: [JOBS_KEY, filters],
    queryFn: () => jobsApi.list(filters),
    placeholderData: (prev) => prev,
    refetchInterval: 10_000,
  });
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: [JOBS_KEY, id],
    queryFn: () => jobsApi.getById(id as string),
    enabled: Boolean(id),
    refetchInterval: 5_000,
  });
}

export function useJobExecutions(id: string | undefined) {
  return useQuery({
    queryKey: [JOBS_KEY, id, 'executions'],
    queryFn: () => jobsApi.getExecutions(id as string),
    enabled: Boolean(id),
  });
}

export function useJobLogs(id: string | undefined) {
  return useQuery({
    queryKey: [JOBS_KEY, id, 'logs'],
    queryFn: () => jobsApi.getLogs(id as string),
    enabled: Boolean(id),
    refetchInterval: 5_000,
  });
}

export function useRetryJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsApi.retry(id),
    onSuccess: (_data, id) => {
      toast.success('Job queued for retry');
      queryClient.invalidateQueries({ queryKey: [JOBS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [JOBS_KEY], exact: false });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useCancelJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsApi.cancel(id),
    onSuccess: (_data, id) => {
      toast.success('Job cancelled');
      queryClient.invalidateQueries({ queryKey: [JOBS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [JOBS_KEY], exact: false });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
