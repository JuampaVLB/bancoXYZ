import { AuthBodyKeys, AuthEndpoints } from '@/constants/api';
import { apiRequest } from '@/lib/api';

export type User = {
  id: number;
  nombre: string;
  email: string;
};

export type AuthSession = {
  token: string;
  user: User;
};

type LoginInput = {
  email: string;
  password: string;
};

const asString = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value : undefined;

const asNumber = (value: unknown) => (typeof value === 'number' ? value : undefined);

const readEmail = (usuario: Record<string, unknown>) =>
  asString(usuario['correo electrónico']) ??
  asString(usuario.correoElectronico) ??
  asString(usuario.email) ??
  asString(usuario.correo) ??
  '';

export const parseAuthResponse = (data: unknown): AuthSession => {
  if (!data || typeof data !== 'object') {
    throw new Error('Respuesta de autenticación inválida');
  }

  const raw = data as { token?: unknown; usuario?: unknown };
  if (typeof raw.token !== 'string' || !raw.token) {
    throw new Error('La API no devolvió un token');
  }

  const usuario =
    raw.usuario && typeof raw.usuario === 'object'
      ? (raw.usuario as Record<string, unknown>)
      : {};

  return {
    token: raw.token,
    user: {
      id: asNumber(usuario.id) ?? 0,
      nombre: asString(usuario.nombre) ?? '',
      email: readEmail(usuario),
    },
  };
};

export const login = async (input: LoginInput) => {
  const data = await apiRequest<unknown>(AuthEndpoints.login, {
    method: 'POST',
    body: {
      [AuthBodyKeys.email]: input.email,
      [AuthBodyKeys.password]: input.password,
    },
  });

  return parseAuthResponse(data);
};
