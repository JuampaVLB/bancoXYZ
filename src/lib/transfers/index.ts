import { TRANSFERS_API_URL, TransferEndpoints } from '@/constants/api';
import { apiRequest } from '@/lib/api';

export type Transfer = {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  payeerName: string;
  payeerDocument: string;
};

export type PeriodFilter = 'month' | 'quarter' | 'year';
export type AmountFilter = 'under100' | 'mid' | 'over500';

export type TransferGroup = {
  key: string;
  title: string;
  transfers: Transfer[];
};

const shortMonths = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const longMonths = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

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

const parseTransferDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
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

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatTransferDate = (date: Date) =>
  `${date.getDate()} ${shortMonths[date.getMonth()]} ${date.getFullYear()}`;

export const formatTransferRange = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  return `${day} ${shortMonths[date.getMonth()]} ${date.getFullYear()}`;
};

export const isScheduledTransfer = (date: Date, today = new Date()) =>
  startOfDay(date).getTime() > startOfDay(today).getTime();

export const periodRange = (period: PeriodFilter, today = new Date()) => {
  const current = startOfDay(today);

  if (period === 'month') {
    return {
      from: new Date(current.getFullYear(), current.getMonth(), 1),
      to: new Date(current.getFullYear(), current.getMonth() + 1, 0),
    };
  }

  if (period === 'quarter') {
    return {
      from: new Date(current.getFullYear(), current.getMonth() - 2, 1),
      to: new Date(current.getFullYear(), current.getMonth() + 1, 0),
    };
  }

  return {
    from: new Date(current.getFullYear(), 0, 1),
    to: new Date(current.getFullYear(), 11, 31),
  };
};

const matchesAmount = (amount: number, filter: AmountFilter) => {
  const value = Math.abs(amount);

  if (filter === 'under100') {
    return value < 100;
  }

  if (filter === 'mid') {
    return value >= 100 && value <= 500;
  }

  return value > 500;
};

export const filterTransfers = (
  transfers: Transfer[],
  options: {
    query: string;
    period: PeriodFilter | null;
    amount: AmountFilter | null;
    today?: Date;
  },
) => {
  const query = options.query.trim().toLowerCase();
  const range = options.period ? periodRange(options.period, options.today) : null;

  return transfers.filter((transfer) => {
    if (query) {
      const haystack = `${transfer.payeerName} ${transfer.payeerDocument}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    if (options.amount && !matchesAmount(transfer.amount, options.amount)) {
      return false;
    }

    if (range) {
      const time = startOfDay(transfer.date).getTime();
      if (time < range.from.getTime() || time > range.to.getTime()) {
        return false;
      }
    }

    return true;
  });
};

export const groupTransfers = (transfers: Transfer[]): TransferGroup[] => {
  const groups = new Map<string, TransferGroup>();

  for (const transfer of transfers) {
    const key = `${transfer.date.getFullYear()}-${String(transfer.date.getMonth() + 1).padStart(2, '0')}`;
    const current = groups.get(key);

    if (current) {
      current.transfers.push(transfer);
      continue;
    }

    groups.set(key, {
      key,
      title: `${longMonths[transfer.date.getMonth()]} ${transfer.date.getFullYear()}`,
      transfers: [transfer],
    });
  }

  return [...groups.values()].sort((left, right) => right.key.localeCompare(left.key));
};

const parseTransfer = (value: unknown, index: number): Transfer | null => {
  const raw = asRecord(value);
  if (!raw) {
    return null;
  }

  const amount = firstNumber(raw, ['valor', 'value', 'amount']);
  const dateValue = firstString(raw, ['fecha', 'data', 'date']);
  const date = dateValue ? parseTransferDate(dateValue) : null;

  if (amount === undefined || !date) {
    return null;
  }

  const payeer = asRecord(raw.payeer) ?? asRecord(raw.payer) ?? asRecord(raw.pagador) ?? {};

  return {
    id: `${dateValue}-${amount}-${index}`,
    amount,
    currency: firstString(raw, ['moneda', 'moeda', 'currency']) ?? '',
    date,
    payeerName: firstString(payeer, ['nombre', 'nome', 'name']) ?? 'Sin nombre',
    payeerDocument: firstString(payeer, ['documento', 'document']) ?? '',
  };
};

export const parseTransferList = (data: unknown): Transfer[] => {
  const list = Array.isArray(data) ? data : asRecord(data)?.transferencias ?? asRecord(data)?.transfers;

  if (!Array.isArray(list)) {
    throw new Error('Respuesta de transferencias inválida');
  }

  return list
    .map(parseTransfer)
    .filter((transfer): transfer is Transfer => transfer !== null)
    .sort((left, right) => right.date.getTime() - left.date.getTime());
};

export const getTransfers = async (token: string) => {
  if (!TRANSFERS_API_URL) {
    return [];
  }

  const sessionToken = token.replace(/^Bearer\s+/i, '').trim();
  const data = await apiRequest<unknown>(TransferEndpoints.list, {
    token: sessionToken,
    baseUrl: TRANSFERS_API_URL,
    unauthorizedMessage: 'La sesión no es válida. Volvé a iniciar sesión.',
    notFoundMessage: 'No se pudieron obtener las transferencias.',
    fallbackMessage: 'No se pudieron obtener las transferencias.',
  });

  return parseTransferList(data);
};
