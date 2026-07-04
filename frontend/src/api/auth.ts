import { api } from './axios';

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../types';

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },
};
