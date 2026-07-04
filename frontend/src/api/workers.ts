import { api } from './axios';

import type {
  PaginatedResponse,
  PaginationParams,
  Worker,
  WorkerHeartbeat,
} from '../types';

export const workersApi = {
  async list(params: PaginationParams = {}): Promise<PaginatedResponse<Worker>> {
    const { data } = await api.get<PaginatedResponse<Worker>>('/workers', {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<Worker> {
    const { data } = await api.get<Worker>(`/workers/${id}`);
    return data;
  },

  async getHeartbeats(id: string, limit = 30): Promise<WorkerHeartbeat[]> {
    const { data } = await api.get<WorkerHeartbeat[]>(`/workers/${id}/heartbeats`, {
      params: { limit },
    });
    return data;
  },

  async shutdown(id: string): Promise<Worker> {
    const { data } = await api.post<Worker>(`/workers/${id}/shutdown`);
    return data;
  },
};
