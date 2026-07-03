import axios from 'axios';
import { LoginDto, RegisterDto } from '../types/auth.types';

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL?: string;
    };
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const authService = {
  /** POST /auth/login */
  login: async (payload: LoginDto) => {
    const { data } = await axios.post<{ accessToken: string }>(`${API_URL}/auth/login`, payload);
    localStorage.setItem('token', data.accessToken);
    return data;
  },

  /** POST /auth/register */
  register: async (payload: RegisterDto) => {
    const { data } = await axios.post<{ accessToken: string }>(`${API_URL}/auth/register`, payload);
    localStorage.setItem('token', data.accessToken);
    return data;
  },

  /** Clear token and optionally redirect */
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  /** Helper to check authentication state */
  isAuthenticated: () => !!localStorage.getItem('token'),
};