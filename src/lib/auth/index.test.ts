import { describe, expect, it } from '@jest/globals';

import { parseAuthResponse } from '.';

describe('parseAuthResponse', () => {
  it('arma la sesión con el token y el usuario', () => {
    const session = parseAuthResponse({
      token: 'abc',
      usuario: { id: 1, nombre: 'Ana', email: 'ana@ejemplo.com' },
    });

    expect(session).toEqual({
      token: 'abc',
      user: { id: 1, nombre: 'Ana', email: 'ana@ejemplo.com' },
    });
  });

  it('falla si la API no devuelve token', () => {
    expect(() => parseAuthResponse({ usuario: {} })).toThrow('La API no devolvió un token');
  });
});
