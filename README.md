# bancoXYZ

App mobile de home banking. Login, saldo, transferencias e historial.

## Tecnologías

- React Native con Expo
- TypeScript
- Expo Router
- TanStack React Query
- Expo SecureStore
- Expo Haptics
- `@react-native-community/datetimepicker`
- Jest con `jest-expo`

## Estructura

`src/app` arma la navegación. Cada archivo de ruta es corto y llama a la screen que le corresponde.

Hay dos grupos:

- `(auth)`: bienvenida y login. Se muestran cuando no hay sesión.
- `(app)`: Inicio, Transferir e Historial. Se muestran cuando la sesión está guardada.

La vista vive en `src/screens/<nombre>/`, con `index.tsx` y `styles.ts` separados.

Lo que solo usa esa pantalla queda adentro de ella: un componente en `screens/<nombre>/components/` y un helper en `screens/<nombre>/utils/`. El date picker de transferir, por ejemplo, está en `screens/transfer/components/date-field` porque no lo usa nadie más.

Lo que se comparte entre pantallas sale de ahí:

- `src/components`: input, botón, ítem de transferencia, tab bar.
- `src/lib`: login, saldo, listado y alta de transferencias.
- `src/hooks` y `src/contexts`: sesión y las queries.

```txt
src/
  app/
    (auth)/          bienvenida y login
    (app)/           inicio, transferir, historial
  screens/
    login/
      index.tsx
      styles.ts
    transfer/
      index.tsx
      styles.ts
      components/    solo de esta pantalla
      utils/
  components/        piezas compartidas
  lib/               requests y parseo
```

## Funciones

- Iniciar sesión con email y contraseña.
- Guardar el token y el usuario en SecureStore y entrar al Home.
- Ver el saldo.
- Ver las últimas transferencias en el Home.
- Transferir: monto, destinatario, documento y fecha, con confirmación.
- Programar una transferencia con fecha futura.
- Ver el historial completo, buscar y filtrar por período y monto.
- Cerrar sesión.

## Flujo

<img width="1504" height="903" alt="image" src="https://github.com/user-attachments/assets/01464f94-9941-41ca-9e45-274706802922" />

### Link: https://excalidraw.com/#json=v_AmYXuwj_OB5czkcalGs,LrnUCvufL87xAdImYiZ_lw

## Diseño UX/UI

<img width="1136" height="741" alt="image" src="https://github.com/user-attachments/assets/34ef73c1-0c05-45cb-a564-3467b663622f" />

### Link: [https://excalidraw.com/#json=v_AmYXuwj_OB5czkcalGs,LrnUCvufL87xAdImYiZ_lw](https://www.figma.com/design/HcHgIB18b1hvzItenaEGHS/Accusys?node-id=0-1&t=NcFE0cG5Wgl05iPM-1)

## Cómo ejecutarlo

```bash
npm install
npm start
```

Copiá `.env.example` a `.env` y completá las URLs:

```txt
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_BALANCE_API_URL=
EXPO_PUBLIC_TRANSFERS_API_URL=
EXPO_PUBLIC_TRANSFER_API_URL=
```

## Pruebas unitarias

```bash
npm test
```

- `parseAuthResponse` arma la sesión con `token` y `usuario`. Falla si no viene el token.
- `parseBalance` lee `saldoCuenta` y `moneda`. Falla si no viene el saldo.
- `parseTransferList` convierte la lista y la ordena de la más nueva a la más vieja. Falla si la respuesta no es una lista.
- `filterTransfers` busca por nombre y filtra por monto. `groupTransfers` agrupa por mes.
- `validateTransfer` exige monto mayor a 0, nombre, documento de 7 u 8 números, y un monto que no supere el saldo.
- `toTransferDate` arma la fecha como `AAAA-MM-DD`.

## Demo

https://github.com/user-attachments/assets/be25fd73-6870-4129-b90b-aa0c966cfcb9

