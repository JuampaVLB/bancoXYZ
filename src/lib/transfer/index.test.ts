import { describe, expect, it } from '@jest/globals';

import { parseTransferDate, toTransferDate } from '.';

describe('toTransferDate', () => {
  it('arma la fecha como AAAA-MM-DD', () => {
    expect(toTransferDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('parseTransferDate', () => {
  it('lee una fecha válida', () => {
    expect(parseTransferDate('2026-11-09')).toEqual(new Date(2026, 10, 9));
  });

  it('devuelve null si la fecha no existe o tiene otro formato', () => {
    expect(parseTransferDate('2026-02-30')).toBeNull();
    expect(parseTransferDate('09/11/2026')).toBeNull();
  });
});
