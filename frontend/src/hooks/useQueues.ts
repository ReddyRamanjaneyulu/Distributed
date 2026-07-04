import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { queuesApi } from '../api/queues';
import { extractErrorMessage } from '../api/axios';

import type {
  CreateQueuePayload,
  PaginationParams,
  Queue,
  UpdateQueuePayload,
} from '../types';

const QUEUES_KEY = 'queues';

export function useQueues(params: PaginationParams) {
  return useQuery({
    queryKey: [QUEUES_KEY, params],
    queryFn: () => queuesApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useQueue(id: string | undefined) {
  return useQuery({
    queryKey: [QUEUES_KEY, id],
    queryFn: () => queuesApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useQueueStatistics(id: string | undefined) {
  return useQuery({
    queryKey: [QUEUES_KEY, id, 'statistics'],
    queryFn: () => queuesApi.getStatistics(id as string),
    enabled: Boolean(id),
    refetchInterval: 10_000,
  });
}

export function useQueueMetrics(id: string | undefined) {
  return useQuery({
    queryKey: [QUEUES_KEY, id, 'metrics'],
    queryFn: () => queuesApi.getMetrics(id as string),
    enabled: Boolean(id),
    refetchInterval: 10_000,
  });
}

export function useQueueWorkers(id: string | undefined) {
  return useQuery({
    queryKey: [QUEUES_KEY, id, 'workers'],
    queryFn: () => queuesApi.getWorkers(id as string),
    enabled: Boolean(id),
    refetchInterval: 15_000,
  });
}

export function useQueueRecentJobs(id: string | undefined, limit = 20) {
  return useQuery({
    queryKey: [QUEUES_KEY, id, 'jobs', limit],
    queryFn: () => queuesApi.getRecentJobs(id as string, limit),
    enabled: Boolean(id),
    refetchInterval: 8_000,
  });
}

export function useQueueFailedJobs(id: string | undefined, limit = 50) {
  return useQuery({
    queryKey: [QUEUES_KEY, id, 'jobs', 'failed', limit],
    queryFn: () => queuesApi.getFailedJobs(id as string, limit),
    enabled: Boolean(id),
  });
}

export function useQueueDeadJobs(id: string | undefined, limit = 50) {
  return useQuery({
    queryKey: [QUEUES_KEY, id, 'jobs', 'dead', limit],
    queryFn: () => queuesApi.getDeadJobs(id as string, limit),
    enabled: Boolean(id),
  });
}

export function useCreateQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQueuePayload) => queuesApi.create(payload),
    onSuccess: () => {
      toast.success('Queue created');
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQueuePayload }) =>
      queuesApi.update(id, payload),
    onSuccess: () => {
      toast.success('Queue updated');
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queuesApi.remove(id),
    onSuccess: () => {
      toast.success('Queue deleted');
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function usePauseQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queuesApi.pause(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [QUEUES_KEY, id] });
      const previous = queryClient.getQueryData<Queue>([QUEUES_KEY, id]);

      if (previous) {
        queryClient.setQueryData<Queue>([QUEUES_KEY, id], {
          ...previous,
          paused: true,
          status: 'PAUSED',
        });
      }

      return { previous };
    },

    onError: (error, id, context) => {
      toast.error(extractErrorMessage(error));
      if (context?.previous) {
        queryClient.setQueryData([QUEUES_KEY, id], context.previous);
      }
    },

    onSuccess: () => toast.success('Queue paused'),

    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY], exact: false });
    },
  });
}

export function useResumeQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queuesApi.resume(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [QUEUES_KEY, id] });
      const previous = queryClient.getQueryData<Queue>([QUEUES_KEY, id]);

      if (previous) {
        queryClient.setQueryData<Queue>([QUEUES_KEY, id], {
          ...previous,
          paused: false,
          status: 'ACTIVE',
        });
      }

      return { previous };
    },

    onError: (error, id, context) => {
      toast.error(extractErrorMessage(error));
      if (context?.previous) {
        queryClient.setQueryData([QUEUES_KEY, id], context.previous);
      }
    },

    onSuccess: () => toast.success('Queue resumed'),

    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY], exact: false });
    },
  });
}
