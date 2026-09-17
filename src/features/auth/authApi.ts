import { apiRequest } from '../../lib/httpClient';

export interface CurrentUser {
  id_user: string;
  email: string;
  name: string;
}

export async function loginRequest(email: string, password: string): Promise<string> {
  const data = await apiRequest<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: { email, password },
    errorMessages: { 401: 'Email ou senha incorretos.' },
    fallbackErrorMessage: 'Não foi possível entrar. Tente novamente.',
  });

  return data.access_token;
}

export async function getMeRequest(token: string): Promise<CurrentUser> {
  return apiRequest<CurrentUser>('/users/me', {
    token,
    fallbackErrorMessage: 'Sessão expirada.',
  });
}

export async function signupRequest(name: string, email: string, password: string): Promise<void> {
  await apiRequest<void>('/users', {
    method: 'POST',
    body: { name, email, password },
    errorMessages: { 409: 'Já existe uma conta com esse email.' },
    fallbackErrorMessage: 'Não foi possível criar a conta. Tente novamente.',
  });
}
