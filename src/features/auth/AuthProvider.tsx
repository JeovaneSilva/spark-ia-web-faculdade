import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { getMeRequest, loginRequest, signupRequest, type CurrentUser } from './authApi';
import { getToken, setToken as storeToken, clearToken } from '../../lib/tokenStorage';
import { ApiError } from '../../lib/httpClient';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const isLoading = token !== null && user === null && connectionError === null;

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    getMeRequest(token)
      .then((currentUser) => {
        if (cancelled) return;
        setConnectionError(null);
        setUser(currentUser);
      })
      .catch((error) => {
        if (cancelled) return;

        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          clearToken();
          setToken(null);
          return;
        }

        // Erro de rede/servidor não desloga o usuário, mas também não pode
        // deixar a tela em branco: mostra o motivo e permite tentar de novo.
        setConnectionError(
          error instanceof ApiError
            ? `O servidor respondeu com erro (${error.status}): ${error.message}`
            : 'Não consegui falar com o servidor. Verifique sua conexão e se a API está no ar.',
        );
      });

    return () => {
      cancelled = true;
    };
  }, [token, attempt]);

  const retry = () => {
    setConnectionError(null);
    setAttempt((value) => value + 1);
  };

  const login = async (email: string, password: string) => {
    const accessToken = await loginRequest(email, password);
    storeToken(accessToken);
    setToken(accessToken);
  };

  const signup = async (name: string, email: string, password: string) => {
    await signupRequest(name, email, password);
    await login(email, password);
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
    setConnectionError(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: token !== null, isLoading, user, connectionError, retry, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
