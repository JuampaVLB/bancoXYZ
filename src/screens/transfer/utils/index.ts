export const DOCUMENT_MAX_LENGTH = 8;

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const startOfToday = () => startOfDay(new Date());

export const isToday = (date: Date) => startOfToday().getTime() === date.getTime();

export const parseAmount = (value: string) => {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
};

type TransferDraft = {
  amount: number | null;
  recipientName: string;
  document: string;
  currency: string;
  availableBalance?: number;
};

export const validateTransfer = ({
  amount,
  recipientName,
  document,
  currency,
  availableBalance,
}: TransferDraft) => {
  if (amount === null || amount <= 0) {
    return 'Ingresá un monto mayor a 0.';
  }

  if (!recipientName.trim()) {
    return 'Ingresá el nombre del destinatario.';
  }

  if (!/^\d{7,8}$/.test(document)) {
    return document
      ? 'El documento tiene que tener 7 u 8 números.'
      : 'Ingresá el documento del destinatario.';
  }

  if (!currency) {
    return 'No se pudo obtener la moneda de la cuenta.';
  }

  if (availableBalance !== undefined && amount > availableBalance) {
    return 'El monto supera el saldo disponible.';
  }

  return null;
};

export const sanitizeDocument = (value: string) =>
  value.replace(/\D/g, '').slice(0, DOCUMENT_MAX_LENGTH);

export const canSubmitTransfer = ({
  amount,
  recipientName,
  document,
}: Pick<TransferDraft, 'amount' | 'recipientName' | 'document'>) =>
  amount !== null &&
  amount > 0 &&
  recipientName.trim().length > 0 &&
  /^\d{7,8}$/.test(document);
