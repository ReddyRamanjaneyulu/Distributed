import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { retryPoliciesApi } from '../api/retryPolicies';
import { extractErrorMessage } from '../api/axios';

import type {
  CreateRetryPolicyPayload,
  PaginationParams,
  UpdateRetryPolicyPayload,
} from '../types';

const RETRY_POLICIES_KEY = 'retry-policies';

export function useRetryPolicies(params: PaginationParams) {
  return useQuery({
    queryKey: [RETRY_POLICIES_KEY, params],
    queryFn: () => retryPoliciesApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useRetryPolicy(id: string | undefined) {
  return useQuery({
    queryKey: [RETRY_POLICIES_KEY, id],
    queryFn: () => retryPoliciesApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateRetryPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRetryPolicyPayload) => retryPoliciesApi.create(payload),
    onSuccess: () => {
      toast.success('Retry policy created');
      queryClient.invalidateQueries({ queryKey: [RETRY_POLICIES_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateRetryPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRetryPolicyPayload }) =>
      retryPoliciesApi.update(id, payload),
    onSuccess: () => {
      toast.success('Retry policy updated');
      queryClient.invalidateQueries({ queryKey: [RETRY_POLICIES_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteRetryPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => retryPoliciesApi.remove(id),
    onSuccess: () => {
      toast.success('Retry policy deleted');
      queryClient.invalidateQueries({ queryKey: [RETRY_POLICIES_KEY] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
