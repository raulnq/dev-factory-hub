import { useSuspenseQuery } from '@tanstack/react-query';
import {
  getClientBalance,
  getClientBalanceSummary,
} from './clientBalanceClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  ClientBalanceSummaryQuery,
  ListClientBalance,
} from '#/features/client-balance/schemas';

export function useClientBalanceSummarySuspense(
  params: ClientBalanceSummaryQuery
) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['client-balance-summary', params],
    queryFn: async () => {
      const token = await getToken();
      return getClientBalanceSummary(params, token);
    },
  });
}

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
