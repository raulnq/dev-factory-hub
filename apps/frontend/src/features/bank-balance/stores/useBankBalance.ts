import { useSuspenseQuery } from '@tanstack/react-query';
import { getBankBalance } from './bankBalanceClient';
import { useAuth } from '@clerk/clerk-react';
import type { ListBankBalance } from '#/features/bank-balance/schemas';

export function useBankBalanceSuspense(params: ListBankBalance) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['bank-balance', params],
    queryFn: async () => {
      const token = await getToken();
      return getBankBalance(params, token);
    },
  });
}
