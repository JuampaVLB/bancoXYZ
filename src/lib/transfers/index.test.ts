import { describe, expect, it } from '@jest/globals';

import { filterTransfers, groupTransfers, isScheduledTransfer, parseTransferList } from '.';

const apiResponse = [
  { valor: 50, fecha: '2026-10-02', moneda: 'ARS', payeer: { nombre: 'Ana', documento: '111' } },
  { valor: 800, fecha: '2026-11-03', moneda: 'ARS', payeer: { nombre: 'Luis', documento: '222' } },
];

describe('parseTransferList', () => {
  it('convierte la respuesta de la API y ordena de la más nueva a la más vieja', () => {
    const transfers = parseTransferList(apiResponse);

    expect(transfers).toHaveLength(2);
    expect(transfers[0].payeerName).toBe('Luis');
    expect(transfers[1].amount).toBe(50);
  });

  it('falla si la respuesta no es una lista', () => {
    expect(() => parseTransferList({ error: true })).toThrow('Respuesta de transferencias inválida');
  });
});

describe('filterTransfers', () => {
  const transfers = parseTransferList(apiResponse);

  it('busca por nombre', () => {
    const result = filterTransfers(transfers, { query: 'ana', period: null, amount: null });
    expect(result.map((transfer) => transfer.payeerName)).toEqual(['Ana']);
  });

  it('filtra por monto', () => {
    const result = filterTransfers(transfers, { query: '', period: null, amount: 'over500' });
    expect(result.map((transfer) => transfer.payeerName)).toEqual(['Luis']);
  });
});

describe('groupTransfers', () => {
  it('agrupa por mes', () => {
    const groups = groupTransfers(parseTransferList(apiResponse));
    expect(groups.map((group) => group.title)).toEqual(['Noviembre 2026', 'Octubre 2026']);
  });
});

describe('isScheduledTransfer', () => {
  it('marca como programada solo una fecha futura', () => {
    const today = new Date(2026, 10, 9);
    expect(isScheduledTransfer(new Date(2026, 10, 10), today)).toBe(true);
    expect(isScheduledTransfer(new Date(2026, 10, 9), today)).toBe(false);
  });
});
