import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listInvoices,
  getInvoice,
  addInvoice,
  editInvoice,
  issueInvoice,
  cancelInvoice,
} from './invoicesClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddInvoice,
  EditInvoice,
  IssueInvoice,
  ListInvoices,
} from '#/features/invoices/schemas';

export function useInvoicesSuspense({
  pageNumber,
  pageSize,
  clientId,
}: Partial<ListInvoices> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    clientId,
  };
  return useSuspenseQuery({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const token = await getToken();
      return listInvoices(params, token);
    },
  });
}

export function useInvoiceSuspense(invoiceId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      const token = await getToken();
      return getInvoice(invoiceId, token);
    },
  });
}

export function useAddInvoice() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddInvoice) => {
      const token = await getToken();
      return addInvoice(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useEditInvoice(invoiceId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditInvoice) => {
      const token = await getToken();
      return editInvoice(invoiceId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.setQueryData(['invoice', invoiceId], data);
    },
  });
}

export function useIssueInvoice(invoiceId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: IssueInvoice) => {
      const token = await getToken();
      return issueInvoice(invoiceId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.setQueryData(['invoice', invoiceId], data);
    },
  });
}

export function useCancelInvoice(invoiceId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return cancelInvoice(invoiceId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.setQueryData(['invoice', invoiceId], data);
    },
  });
}
