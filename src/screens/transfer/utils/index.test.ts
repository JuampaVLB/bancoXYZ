import { describe, expect, it } from '@jest/globals';

import { canSubmitTransfer, parseAmount, sanitizeDocument, validateTransfer } from '.';

describe('parseAmount', () => {
  it('lee montos con punto o coma', () => {
    expect(parseAmount('150')).toBe(150);
    expect(parseAmount('150.5')).toBe(150.5);
    expect(parseAmount('150,25')).toBe(150.25);
  });

  it('devuelve null si el monto no es válido', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('10.123')).toBeNull();
  });
});

describe('sanitizeDocument', () => {
  it('deja solo números y como máximo 8', () => {
    expect(sanitizeDocument('12.345.678')).toBe('12345678');
    expect(sanitizeDocument('123456789')).toBe('12345678');
  });
});

describe('validateTransfer', () => {
  const valid = {
    amount: 100,
    recipientName: 'Ana',
    document: '12345678',
    currency: 'ARS',
    availableBalance: 500,
  };

  it('acepta una transferencia completa', () => {
    expect(validateTransfer(valid)).toBeNull();
  });

  it('rechaza un monto vacío o en cero', () => {
    expect(validateTransfer({ ...valid, amount: null })).toBe('Ingresá un monto mayor a 0.');
    expect(validateTransfer({ ...valid, amount: 0 })).toBe('Ingresá un monto mayor a 0.');
  });

  it('pide el nombre del destinatario', () => {
    expect(validateTransfer({ ...valid, recipientName: '  ' })).toBe(
      'Ingresá el nombre del destinatario.',
    );
  });

  it('pide un documento de 7 u 8 números', () => {
    expect(validateTransfer({ ...valid, document: '' })).toBe(
      'Ingresá el documento del destinatario.',
    );
    expect(validateTransfer({ ...valid, document: '123' })).toBe(
      'El documento tiene que tener 7 u 8 números.',
    );
  });

  it('no deja transferir más que el saldo', () => {
    expect(validateTransfer({ ...valid, amount: 600 })).toBe(
      'El monto supera el saldo disponible.',
    );
  });
});

describe('canSubmitTransfer', () => {
  it('habilita el botón solo con todos los datos', () => {
    expect(canSubmitTransfer({ amount: 10, recipientName: 'Ana', document: '1234567' })).toBe(true);
    expect(canSubmitTransfer({ amount: null, recipientName: 'Ana', document: '1234567' })).toBe(
      false,
    );
    expect(canSubmitTransfer({ amount: 10, recipientName: '', document: '1234567' })).toBe(false);
    expect(canSubmitTransfer({ amount: 10, recipientName: 'Ana', document: '12' })).toBe(false);
  });
});
