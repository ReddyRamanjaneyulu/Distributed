import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authApi } from '../api/auth';
import { tokenStorage } from '../utils/storage';

import type { LoginPayload, RegisterPayload, User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_CACHE_KEY = 'scheduler_user';

function readCachedUser(): User | null {
  const raw = localStorage.getItem(USER_CACHE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readCachedUser());
  const [isInitializing] = useState(false);

  const persistUser = useCallback((nextUser: User) => {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authApi.login(payload);
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      persistUser(response.user);
    },
    [persistUser],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authApi.register(payload);
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      persistUser(response.user);
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    localStorage.removeItem(USER_CACHE_KEY);
    setUser(null);
    window.location.assign('/login');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && tokenStorage.getAccessToken()),
      isInitializing,
      login,
      register,
      logout,
    }),
    [user, isInitializing, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
}
