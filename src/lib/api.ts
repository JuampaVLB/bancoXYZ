import { API_URL } from '@/constants/api';

type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  baseUrl?: string;
  unauthorizedMessage?: string;
  invalidMessage?: string;
  notFoundMessage?: string;
  fallbackMessage?: string;
};

const resolveBaseUrl = (baseUrl?: string) => {
  const trimmed = (baseUrl ?? API_URL).trim().replace(/\/$/, '');
  const value = trimmed && !/^https?:\/\//i.test(trimmed) ? `https://${trimmed}` : trimmed;

  if (!value) {
    throw new Error(
      baseUrl === undefined
        ? 'Configurá EXPO_PUBLIC_API_URL en el archivo .env'
        : 'Configurá EXPO_PUBLIC_BALANCE_API_URL en el archivo .env',
    );
  }

  return value;
};

const readRawMessage = async (response: Response) => {
  try {
    const payload: unknown = await response.json();
    if (typeof payload === 'string' && payload.trim()) {
      return payload.trim();
    }
    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>;
      const message =
        record.message ??
        record.mensaje ??
        record.mensagem ??
        record.motivo ??
        record.title ??
        record.error ??
        record.detail;
      if (typeof message === 'string' && message.trim()) {
        return message.trim();
      }
    }
  } catch {
    // The body is empty or not JSON.
  }

  return undefined;
};

const clientMessage = (status: number, options: ApiRequestOptions) => {
  if (status === 400) {
    return options.invalidMessage ?? 'Los datos enviados no son válidos.';
  }

  if (status === 401) {
    return options.unauthorizedMessage ?? 'La sesión no es válida. Volvé a iniciar sesión.';
  }

  if (status === 404) {
    return options.notFoundMessage ?? 'No se encontró la información.';
  }

  return options.fallbackMessage ?? 'No se pudo completar la acción. Intentá de nuevo.';
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { method = 'GET', body, token, baseUrl } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${resolveBaseUrl(baseUrl)}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (caught) {
    const error = new Error(
      options.fallbackMessage ?? 'No se pudo conectar. Intentá de nuevo.',
    ) as Error & { detail?: unknown };
    error.detail = caught;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(clientMessage(response.status, options)) as Error & { detail?: unknown };
    error.detail = await readRawMessage(response);
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
