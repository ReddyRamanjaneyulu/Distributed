import { api } from './axios';

import type {
  Job,
  JobExecution,
  JobFilters,
  JobLog,
  PaginatedResponse,
} from '../types';

export const jobsApi = {
  async list(filters: JobFilters = {}): Promise<PaginatedResponse<Job>> {
    const { data } = await api.get<PaginatedResponse<Job>>('/jobs', {
      params: filters,
    });
    return data;
  },

  async getById(id: string): Promise<Job> {
    const { data } = await api.get<Job>(`/jobs/${id}`);
    return data;
  },

  async retry(id: string): Promise<Job> {
    const { data } = await api.post<Job>(`/jobs/${id}/retry`);
    return data;
  },

  async cancel(id: string): Promise<Job> {
    const { data } = await api.post<Job>(`/jobs/${id}/cancel`);
    return data;
  },

  async getExecutions(id: string): Promise<JobExecution[]> {
    const { data } = await api.get<JobExecution[]>(`/jobs/${id}/executions`);
    return data;
  },

  async getLogs(id: string): Promise<JobLog[]> {
    const { data } = await api.get<JobLog[]>(`/jobs/${id}/logs`);
    return data;
  },
};
