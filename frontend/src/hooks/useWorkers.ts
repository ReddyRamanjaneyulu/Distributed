import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { workersApi } from '../api/workers';
import { extractErrorMessage } from '../api/axios';

import type { PaginationParams } from '../types';

const WORKERS_KEY = 'workers';

export function useWorkers(params: PaginationParams) {
  return useQuery({
    queryKey: [WORKERS_KEY, params],
    queryFn: () => workersApi.list(params),
    placeholderData: (prev) => prev,
    refetchInterval: 8_000,
  });
}

export function useWorker(id: string | undefined) {
  return useQuery({
    queryKey: [WORKERS_KEY, id],
    queryFn: () => workersApi.getById(id as string),
    enabled: Boolean(id),
    refetchInterval: 8_000,
  });
}

export function useWorkerHeartbeats(id: string | undefined, limit = 30) {
  return useQuery({
    queryKey: [WORKERS_KEY, id, 'heartbeats', limit],
    queryFn: () => workersApi.getHeartbeats(id as string, limit),
    enabled: Boolean(id),
    refetchInterval: 10_000,
  });
}

export function useShutdownWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workersApi.shutdown(id),
    onSuccess: (_data, id) => {
      toast.success('Shutdown signal sent');
      queryClient.invalidateQueries({ queryKey: [WORKERS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [WORKERS_KEY], exact: false });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
