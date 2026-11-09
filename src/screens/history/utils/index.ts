import type { AmountFilter, PeriodFilter } from '@/lib/transfers';

export const periodOptions: { id: PeriodFilter; label: string }[] = [
  { id: 'month', label: 'Este mes' },
  { id: 'quarter', label: 'Últimos 3 meses' },
  { id: 'year', label: 'Este año' },
];

export const amountOptions: { id: AmountFilter; label: string }[] = [
  { id: 'under100', label: 'Menos de $100' },
  { id: 'mid', label: '$100 – $500' },
  { id: 'over500', label: 'Más de $500' },
];
