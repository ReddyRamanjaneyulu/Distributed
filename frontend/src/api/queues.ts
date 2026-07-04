import { api } from './axios';

import type {
  CreateQueuePayload,
  Job,
  PaginatedResponse,
  PaginationParams,
  Queue,
  QueueMetrics,
  QueueStatistics,
  UpdateQueuePayload,
  Worker,
} from '../types';

export const queuesApi = {
  async list(params: PaginationParams = {}): Promise<PaginatedResponse<Queue>> {
    const { data } = await api.get<PaginatedResponse<Queue>>('/queues', {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<Queue> {
    const { data } = await api.get<Queue>(`/queues/${id}`);
    return data;
  },

  async create(payload: CreateQueuePayload): Promise<Queue> {
    const { data } = await api.post<Queue>('/queues', payload);
    return data;
  },

  async update(id: string, payload: UpdateQueuePayload): Promise<Queue> {
    const { data } = await api.patch<Queue>(`/queues/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/queues/${id}`);
  },

  async pause(id: string): Promise<Queue> {
    const { data } = await api.post<Queue>(`/queues/${id}/pause`);
    return data;
  },

  async resume(id: string): Promise<Queue> {
    const { data } = await api.post<Queue>(`/queues/${id}/resume`);
    return data;
  },

  async getStatistics(id: string): Promise<QueueStatistics> {
    const { data } = await api.get<QueueStatistics>(`/queues/${id}/statistics`);
    return data;
  },

  async getMetrics(id: string): Promise<QueueMetrics> {
    const { data } = await api.get<QueueMetrics>(`/queues/${id}/metrics`);
    return data;
  },

  async getWorkers(id: string): Promise<Worker[]> {
    const { data } = await api.get<Worker[]>(`/queues/${id}/workers`);
    return data;
  },

  async getRecentJobs(id: string, limit = 20): Promise<Job[]> {
    const { data } = await api.get<Job[]>(`/queues/${id}/jobs`, {
      params: { limit },
    });
    return data;
  },

  async getFailedJobs(id: string, limit = 50): Promise<Job[]> {
    const { data } = await api.get<Job[]>(`/queues/${id}/jobs/failed`, {
      params: { limit },
    });
    return data;
  },

  async getDeadJobs(id: string, limit = 50): Promise<Job[]> {
    const { data } = await api.get<Job[]>(`/queues/${id}/jobs/dead`, {
      params: { limit },
    });
    return data;
  },
};
