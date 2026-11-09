import { TRANSFER_API_URL, TransferEndpoints } from '@/constants/api';
import { apiRequest } from '@/lib/api';

export type TransferInput = {
  amount: number;
  currency: string;
  document: string;
  date: string;
};

const asRecord = (value: unknown) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const normalizeState = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const successStates = new Set(['exito', 'sucesso', 'success', 'ok', 'exitoso']);

const failureStates = new Set(['error', 'erro', 'fail', 'failed', 'fallo']);

const readRecord = (data: unknown) => {
  let payload = data;

  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload) as unknown;
    } catch {
      return null;
    }
  }

  const record = asRecord(payload);
  if (!record) {
    return null;
  }

  const nested = record.body ?? record.data ?? record.resultado;
  if (typeof nested === 'string') {
    try {
      return asRecord(JSON.parse(nested) as unknown) ?? record;
    } catch {
      return record;
    }
  }

  return asRecord(nested) ?? record;
};

const readField = (record: Record<string, unknown>, names: string[]) => {
  const entries = Object.entries(record);
  for (const name of names) {
    const match = entries.find(([key]) => key.toLowerCase() === name);
    if (match) {
      return match[1];
    }
  }

  return undefined;
};

const readFailureMessage = (record: Record<string, unknown> | null) => {
  if (!record) {
    return 'No se pudo realizar la transferencia.';
  }

  const estadoValue = readField(record, ['estado', 'status', 'state', 'resultado', 'result']);
  const estado = typeof estadoValue === 'string' ? normalizeState(estadoValue) : '';
  if (estado && failureStates.has(estado)) {
    return 'La transferencia fue rechazada. Revisá el documento, el monto y la fecha.';
  }

  return 'No se pudo realizar la transferencia.';
};

export const toTransferDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const parseTransferDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
};

const failTransfer = (message: string, detail?: unknown) => {
  const error = new Error(message) as Error & { detail?: unknown };
  error.detail = detail;
  throw error;
};

export const createTransfer = async (token: string, input: TransferInput) => {
  if (!TRANSFER_API_URL) {
    failTransfer('No se pudo realizar la transferencia.', 'TRANSFER_API_URL vacía. Reiniciá Expo.');
  }

  const data = await apiRequest<unknown>(TransferEndpoints.create, {
    method: 'POST',
    token: token.replace(/^Bearer\s+/i, '').trim(),
    baseUrl: TRANSFER_API_URL,
    body: {
      valor: input.amount,
      moneda: input.currency,
      documentoPayeer: input.document,
      fechaDeTransferencia: input.date,
    },
    unauthorizedMessage: 'La sesión no es válida. Volvé a iniciar sesión.',
    invalidMessage:
      'Los datos de la transferencia no son válidos. Revisá el monto, el documento y la fecha.',
    notFoundMessage: 'No se pudo realizar la transferencia.',
    fallbackMessage: 'No se pudo realizar la transferencia. Intentá de nuevo.',
  });

  if (typeof data === 'string' && successStates.has(normalizeState(data))) {
    return;
  }

  const record = readRecord(data);
  const estadoValue = record
    ? readField(record, ['estado', 'status', 'state', 'resultado', 'result'])
    : undefined;
  const estado = typeof estadoValue === 'string' ? normalizeState(estadoValue) : '';

  if (!successStates.has(estado)) {
    failTransfer(readFailureMessage(record), data);
  }
};
