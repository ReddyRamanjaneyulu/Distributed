import { api } from './axios';

import type {
  CreateScheduledJobPayload,
  PaginatedResponse,
  PaginationParams,
  ScheduledJob,
  UpdateScheduledJobPayload,
} from '../types';

export const scheduledJobsApi = {
  async list(params: PaginationParams = {}): Promise<PaginatedResponse<ScheduledJob>> {
    const { data } = await api.get<PaginatedResponse<ScheduledJob>>('/scheduled-jobs', {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<ScheduledJob> {
    const { data } = await api.get<ScheduledJob>(`/scheduled-jobs/${id}`);
    return data;
  },

  async create(payload: CreateScheduledJobPayload): Promise<ScheduledJob> {
    const { data } = await api.post<ScheduledJob>('/scheduled-jobs', payload);
    return data;
  },

  async update(id: string, payload: UpdateScheduledJobPayload): Promise<ScheduledJob> {
    const { data } = await api.patch<ScheduledJob>(`/scheduled-jobs/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/scheduled-jobs/${id}`);
  },

  async toggle(id: string, enabled: boolean): Promise<ScheduledJob> {
    const { data } = await api.patch<ScheduledJob>(`/scheduled-jobs/${id}`, { enabled });
    return data;
  },
};
