import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  addExchangeRate,
  editExchangeRate,
  getExchangeRate,
  listExchangeRates,
} from './exchangeRatesClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddExchangeRate,
  EditExchangeRate,
  ListExchangeRates,
} from '#/features/exchange-rates/schemas';

export function useExchangeRatesSuspense({
  pageNumber,
  pageSize,
  fromCurrency,
}: Partial<ListExchangeRates> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    fromCurrency,
  };
  return useSuspenseQuery({
    queryKey: ['exchange-rates', params],
    queryFn: async () => {
      const token = await getToken();
      return listExchangeRates(params, token);
    },
  });
}

export function useExchangeRateSuspense(exchangeRateId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['exchange-rate', exchangeRateId],
    queryFn: async () => {
      const token = await getToken();
      return getExchangeRate(exchangeRateId, token);
    },
  });
}

export function useAddExchangeRate() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddExchangeRate) => {
      const token = await getToken();
      return addExchangeRate(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchange-rates'] });
    },
  });
}

export function useEditExchangeRate(exchangeRateId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditExchangeRate) => {
      const token = await getToken();
      return editExchangeRate(exchangeRateId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['exchange-rates'] });
      queryClient.setQueryData(['exchange-rate', exchangeRateId], data);
    },
  });
}
