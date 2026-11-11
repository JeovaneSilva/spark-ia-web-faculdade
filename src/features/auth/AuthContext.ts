import { createContext } from 'react';
import type { CurrentUser } from './authApi';

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: CurrentUser | null;
  /** Não foi possível confirmar a sessão (API fora do ar, rede, limite...), sem ser "sessão inválida". */
  connectionError: string | null;
  /** Tenta confirmar a sessão de novo. */
  retry: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
