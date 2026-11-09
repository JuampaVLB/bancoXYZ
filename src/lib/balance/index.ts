import { AccountEndpoints, BALANCE_API_URL } from '@/constants/api';
import { apiRequest } from '@/lib/api';

export type AccountBalance = {
  currency: string;
  amount: number;
};

const asString = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const asNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }

  return undefined;
};

const asRecord = (value: unknown) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const firstString = (raw: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = asString(raw[key]);
    if (value) {
      return value;
    }
  }

  return undefined;
};

const firstNumber = (raw: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = asNumber(raw[key]);
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

const unwrapPayload = (data: unknown) => {
  let payload = data;

  if (typeof payload === 'string') {
    payload = JSON.parse(payload) as unknown;
  }

  const record = asRecord(payload);
  if (!record) {
    return null;
  }

  if (typeof record.body === 'string') {
    return asRecord(JSON.parse(record.body) as unknown) ?? record;
  }

  return asRecord(record.data) ?? asRecord(record.saldo) ?? record;
};

export const parseBalance = (data: unknown): AccountBalance => {
  let raw: Record<string, unknown> | null;

  try {
    raw = unwrapPayload(data);
  } catch {
    throw new Error('Respuesta de saldo inválida');
  }

  if (!raw) {
    throw new Error('Respuesta de saldo inválida');
  }

  const amount = firstNumber(raw, [
    'saldoCuenta',
    'saldoConta',
    'saldo',
    'balance',
    'accountBalance',
  ]);
  const currency = firstString(raw, ['moneda', 'moeda', 'currency']) ?? '';

  if (amount === undefined) {
    throw new Error('La API no devolvió el saldo');
  }

  return { amount, currency };
};

export const formatBalance = (amount: number, currency: string) => {
  const code = currency.trim().toUpperCase();

  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: code,
    }).format(amount);
  } catch {
    const formatted = new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return currency.trim() ? `${currency.trim()} ${formatted}` : formatted;
  }
};

export const getBalance = async (token: string) => {
  const sessionToken = token.replace(/^Bearer\s+/i, '').trim();
  const data = await apiRequest<unknown>(AccountEndpoints.balance, {
    token: sessionToken,
    baseUrl: BALANCE_API_URL,
    unauthorizedMessage: 'La sesión no es válida. Volvé a iniciar sesión.',
    notFoundMessage: 'No se pudo obtener el saldo.',
    fallbackMessage: 'No se pudo obtener el saldo.',
  });

  return parseBalance(data);
};
