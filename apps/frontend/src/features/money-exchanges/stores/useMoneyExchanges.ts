import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listMoneyExchanges,
  getMoneyExchange,
  addMoneyExchange,
  editMoneyExchange,
  issueMoneyExchange,
  cancelMoneyExchange,
  uploadMoneyExchangeFile,
  getMoneyExchangeDownloadUrl,
} from './moneyExchangesClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddMoneyExchange,
  DownloadUrlResponse,
  EditMoneyExchange,
  IssueMoneyExchange,
  ListMoneyExchanges,
} from '#/features/money-exchanges/schemas';

export function useMoneyExchangesSuspense({
  pageNumber,
  pageSize,
  fromCurrency,
  toCurrency,
}: Partial<ListMoneyExchanges> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    fromCurrency,
    toCurrency,
  };
  return useSuspenseQuery({
    queryKey: ['money-exchanges', params],
    queryFn: async () => {
      const token = await getToken();
      return listMoneyExchanges(params, token);
    },
  });
}

export function useMoneyExchangeSuspense(moneyExchangeId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['money-exchange', moneyExchangeId],
    queryFn: async () => {
      const token = await getToken();
      return getMoneyExchange(moneyExchangeId, token);
    },
  });
}

export function useAddMoneyExchange() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddMoneyExchange) => {
      const token = await getToken();
      return addMoneyExchange(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['money-exchanges'] });
    },
  });
}

export function useEditMoneyExchange(moneyExchangeId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditMoneyExchange) => {
      const token = await getToken();
      return editMoneyExchange(moneyExchangeId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['money-exchanges'] });
      queryClient.setQueryData(['money-exchange', moneyExchangeId], data);
    },
  });
}

export function useIssueMoneyExchange(moneyExchangeId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: IssueMoneyExchange) => {
      const token = await getToken();
      return issueMoneyExchange(moneyExchangeId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['money-exchanges'] });
      queryClient.setQueryData(['money-exchange', moneyExchangeId], data);
    },
  });
}

export function useCancelMoneyExchange(moneyExchangeId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return cancelMoneyExchange(moneyExchangeId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['money-exchanges'] });
      queryClient.setQueryData(['money-exchange', moneyExchangeId], data);
    },
  });
}

export function useUploadMoneyExchange(moneyExchangeId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (file: File) => {
      const token = await getToken();
      return uploadMoneyExchangeFile(moneyExchangeId, file, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['money-exchanges'] });
      queryClient.setQueryData(['money-exchange', moneyExchangeId], data);
    },
  });
}

export function useMoneyExchangeDownloadUrl(moneyExchangeId: string) {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (): Promise<DownloadUrlResponse> => {
      const token = await getToken();
      return getMoneyExchangeDownloadUrl(moneyExchangeId, token);
    },
  });
}
