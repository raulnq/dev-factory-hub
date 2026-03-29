import { useSuspenseQuery } from '@tanstack/react-query';
import { getBankBalance, getBankBalanceSummary } from './bankBalanceClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  BankBalanceSummaryQuery,
  ListBankBalance,
} from '#/features/bank-balance/schemas';

export function useBankBalanceSummarySuspense(params: BankBalanceSummaryQuery) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['bank-balance-summary', params],
    queryFn: async () => {
      const token = await getToken();
      return getBankBalanceSummary(params, token);
    },
  });
}

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
