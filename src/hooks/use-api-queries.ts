import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

import { BALANCE_API_URL } from '@/constants/api';
import { useSession } from '@/contexts/auth-context';
import { getBalance } from '@/lib/balance';
import { queryKeys } from '@/lib/query-client';
import { createTransfer, type TransferInput } from '@/lib/transfer';
import { getTransfers } from '@/lib/transfers';

export const useBalance = () => {
  const { token } = useSession();

  return useQuery({
    queryKey: queryKeys.balance,
    queryFn: () => getBalance(token ?? ''),
    enabled: Boolean(token && BALANCE_API_URL),
  });
};

export const useTransfers = () => {
  const { token } = useSession();

  return useQuery({
    queryKey: queryKeys.transfers,
    queryFn: () => getTransfers(token ?? ''),
    enabled: Boolean(token),
  });
};

export const useCreateTransfer = () => {
  const { token } = useSession();
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: TransferInput) => createTransfer(token ?? '', input),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.balance });
      void client.invalidateQueries({ queryKey: queryKeys.transfers });
    },
  });
};

export const useRefetchOnFocus = (refetch: () => unknown) => {
  const firstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }

      void refetch();
    }, [refetch]),
  );
};
