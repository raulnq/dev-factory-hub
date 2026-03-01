import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listTaxPayments,
  getTaxPayment,
  addTaxPayment,
  editTaxPayment,
  payTaxPayment,
  cancelTaxPayment,
  listTaxPaymentItems,
  addTaxPaymentItem,
  deleteTaxPaymentItem,
} from './taxPaymentsClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddTaxPayment,
  EditTaxPayment,
  ListTaxPayments,
  PayTaxPayment,
  AddTaxPaymentItem,
} from '#/features/tax-payments/schemas';

export function useTaxPaymentsSuspense({
  pageNumber,
  pageSize,
  year,
}: Partial<ListTaxPayments> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    year,
  };
  return useSuspenseQuery({
    queryKey: ['tax-payments', params],
    queryFn: async () => {
      const token = await getToken();
      return listTaxPayments(params, token);
    },
  });
}

export function useTaxPaymentSuspense(taxPaymentId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['tax-payment', taxPaymentId],
    queryFn: async () => {
      const token = await getToken();
      return getTaxPayment(taxPaymentId, token);
    },
  });
}

export function useAddTaxPayment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddTaxPayment) => {
      const token = await getToken();
      return addTaxPayment(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-payments'] });
    },
  });
}

export function useEditTaxPayment(taxPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditTaxPayment) => {
      const token = await getToken();
      return editTaxPayment(taxPaymentId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['tax-payments'] });
      queryClient.setQueryData(['tax-payment', taxPaymentId], data);
    },
  });
}

export function usePayTaxPayment(taxPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: PayTaxPayment) => {
      const token = await getToken();
      return payTaxPayment(taxPaymentId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['tax-payments'] });
      queryClient.setQueryData(['tax-payment', taxPaymentId], data);
    },
  });
}

export function useCancelTaxPayment(taxPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return cancelTaxPayment(taxPaymentId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['tax-payments'] });
      queryClient.setQueryData(['tax-payment', taxPaymentId], data);
    },
  });
}

export function useTaxPaymentItemsSuspense({
  taxPaymentId,
  pageNumber = 1,
  pageSize = 5,
}: {
  taxPaymentId: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  const { getToken } = useAuth();
  const params = { pageNumber, pageSize };
  return useSuspenseQuery({
    queryKey: ['tax-payment-items', taxPaymentId, params],
    queryFn: async () => {
      const token = await getToken();
      return listTaxPaymentItems(taxPaymentId, params, token);
    },
  });
}

export function useAddTaxPaymentItem(taxPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddTaxPaymentItem) => {
      const token = await getToken();
      return addTaxPaymentItem(taxPaymentId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tax-payment-items', taxPaymentId],
      });
      queryClient.invalidateQueries({
        queryKey: ['tax-payment', taxPaymentId],
      });
      queryClient.invalidateQueries({ queryKey: ['tax-payments'] });
    },
  });
}

export function useDeleteTaxPaymentItem(taxPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (taxPaymentItemId: string) => {
      const token = await getToken();
      return deleteTaxPaymentItem(taxPaymentId, taxPaymentItemId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tax-payment-items', taxPaymentId],
      });
      queryClient.invalidateQueries({
        queryKey: ['tax-payment', taxPaymentId],
      });
      queryClient.invalidateQueries({ queryKey: ['tax-payments'] });
    },
  });
}
