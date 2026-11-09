import { describe, expect, it } from '@jest/globals';

import { parseBalance } from '.';

describe('parseBalance', () => {
  it('lee el saldo y la moneda de la API', () => {
    expect(parseBalance({ moneda: 'ARS', saldoCuenta: 1500 })).toEqual({
      currency: 'ARS',
      amount: 1500,
    });
  });

  it('falla si la respuesta no trae el saldo', () => {
    expect(() => parseBalance({ moneda: 'ARS' })).toThrow('La API no devolvió el saldo');
  });
});
