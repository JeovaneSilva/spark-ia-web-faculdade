import { createContext } from 'react';
import type { CurrentUser } from './authApi';

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: CurrentUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
