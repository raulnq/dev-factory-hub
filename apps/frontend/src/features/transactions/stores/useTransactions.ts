import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listTransactions,
  getTransaction,
  addTransaction,
  editTransaction,
  issueTransaction,
  cancelTransaction,
  uploadTransactionFile,
  getTransactionDownloadUrl,
} from './transactionsClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddTransaction,
  DownloadUrlResponse,
  EditTransaction,
  IssueTransaction,
  ListTransactions,
} from '#/features/transactions/schemas';

export function useTransactionsSuspense({
  pageNumber,
  pageSize,
  type,
  description,
}: Partial<ListTransactions> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    type,
    description,
  };
  return useSuspenseQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const token = await getToken();
      return listTransactions(params, token);
    },
  });
}

export function useTransactionSuspense(transactionId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const token = await getToken();
      return getTransaction(transactionId, token);
    },
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddTransaction) => {
      const token = await getToken();
      return addTransaction(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useEditTransaction(transactionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditTransaction) => {
      const token = await getToken();
      return editTransaction(transactionId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.setQueryData(['transaction', transactionId], data);
    },
  });
}

export function useIssueTransaction(transactionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: IssueTransaction) => {
      const token = await getToken();
      return issueTransaction(transactionId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.setQueryData(['transaction', transactionId], data);
    },
  });
}

export function useCancelTransaction(transactionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return cancelTransaction(transactionId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.setQueryData(['transaction', transactionId], data);
    },
  });
}

export function useUploadTransaction(transactionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (file: File) => {
      const token = await getToken();
      return uploadTransactionFile(transactionId, file, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.setQueryData(['transaction', transactionId], data);
    },
  });
}

export function useTransactionDownloadUrl(transactionId: string) {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (): Promise<DownloadUrlResponse> => {
      const token = await getToken();
      return getTransactionDownloadUrl(transactionId, token);
    },
  });
}
