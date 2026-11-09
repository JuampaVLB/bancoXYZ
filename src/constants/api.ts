import Constants from 'expo-constants';

type Extra = {
  apiUrl?: string;
  balanceApiUrl?: string;
};

const extra = Constants.expoConfig?.extra as Extra | undefined;

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || extra?.apiUrl || '').trim();

export const BALANCE_API_URL = (
  process.env.EXPO_PUBLIC_BALANCE_API_URL ||
  extra?.balanceApiUrl ||
  ''
).trim();

export const AuthEndpoints = {
  login: '/login',
} as const;

export const AccountEndpoints = {
  balance: '/balance',
} as const;

export const AuthBodyKeys = {
  email: 'email',
  password: 'password',
} as const;
