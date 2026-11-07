import { API_URL } from '@/constants/api';

type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

const requireApiUrl = () => {
  if (!API_URL) {
    throw new Error('Configurá EXPO_PUBLIC_API_URL en el archivo .env');
  }

  return API_URL.replace(/\/$/, '');
};

const readErrorMessage = async (response: Response) => {
  try {
    const payload: unknown = await response.json();
    if (typeof payload === 'string' && payload.trim()) {
      return payload;
    }
    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>;
      const message =
        record.message ?? record.mensaje ?? record.title ?? record.error ?? record.detail;
      if (typeof message === 'string' && message.trim()) {
        if (response.status === 401) {
          return 'Correo o contraseña incorrectos';
        }
        return message;
      }
    }
  } catch {
    // The body is empty or not JSON.
  }

  if (response.status === 401) {
    return 'Correo o contraseña incorrectos';
  }

  return `Error ${response.status}`;
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${requireApiUrl()}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
