import { api } from './axios';

import type {
  CreateRetryPolicyPayload,
  PaginatedResponse,
  PaginationParams,
  RetryPolicy,
  UpdateRetryPolicyPayload,
} from '../types';

export const retryPoliciesApi = {
  async list(params: PaginationParams = {}): Promise<PaginatedResponse<RetryPolicy>> {
    const { data } = await api.get<PaginatedResponse<RetryPolicy>>('/retry-policies', {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<RetryPolicy> {
    const { data } = await api.get<RetryPolicy>(`/retry-policies/${id}`);
    return data;
  },

  async create(payload: CreateRetryPolicyPayload): Promise<RetryPolicy> {
    const { data } = await api.post<RetryPolicy>('/retry-policies', payload);
    return data;
  },

  async update(id: string, payload: UpdateRetryPolicyPayload): Promise<RetryPolicy> {
    const { data } = await api.patch<RetryPolicy>(`/retry-policies/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/retry-policies/${id}`);
  },
};
