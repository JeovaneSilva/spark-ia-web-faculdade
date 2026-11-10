const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body.message === 'string') return body.message;
    if (Array.isArray(body.message)) return body.message.join(', ');
  } catch {
    // resposta sem corpo JSON
  }
  return fallback;
}

interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  /** FormData vai direto, sem JSON.stringify nem Content-Type manual (o browser define o boundary) */
  formData?: FormData;
  token?: string;
  /** Mensagens de erro específicas por status HTTP (ex.: 401 -> "Senha incorreta") */
  errorMessages?: Record<number, string>;
  fallbackErrorMessage?: string;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    formData,
    token,
    errorMessages = {},
    fallbackErrorMessage = 'Algo deu errado. Tente novamente.',
  } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });

  if (!response.ok) {
    const message = errorMessages[response.status] ?? (await parseErrorMessage(response, fallbackErrorMessage));
    throw new ApiError(message, response.status);
  }

  // Algumas rotas respondem texto puro (ex.: POST /users) ou nada (204).
  if (!response.headers.get('content-type')?.includes('application/json')) return undefined as T;
  return response.json() as Promise<T>;
}
