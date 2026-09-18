import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { getMeRequest, loginRequest, signupRequest, type CurrentUser } from './authApi';
import { getToken, setToken as storeToken, clearToken } from '../../lib/tokenStorage';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<CurrentUser | null>(null);

  const isLoading = token !== null && user === null;

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    getMeRequest(token)
      .then((currentUser) => {
        if (!cancelled) setUser(currentUser);
      })
      .catch(() => {
        if (!cancelled) {
          clearToken();
          setToken(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

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
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: token !== null, isLoading, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
