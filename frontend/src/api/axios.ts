import axios from 'axios';

import { tokenStorage } from '../utils/storage';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export function extractErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          message?: string | string[];
        }
      | undefined;

    if (Array.isArray(data?.message)) {
      return data.message.join(', ');
    }

    if (typeof data?.message === 'string') {
      return data.message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}