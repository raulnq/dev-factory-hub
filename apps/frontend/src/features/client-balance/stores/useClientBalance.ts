import { useSuspenseQuery } from '@tanstack/react-query';
import { getClientBalance } from './clientBalanceClient';
import { useAuth } from '@clerk/clerk-react';
import type { ListClientBalance } from '#/features/client-balance/schemas';

export function useClientBalanceSuspense(params: ListClientBalance) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['client-balance', params],
    queryFn: async () => {
      const token = await getToken();
      return getClientBalance(params, token);
    },
  });
}
