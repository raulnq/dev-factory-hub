import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listPayrollPayments,
  getPayrollPayment,
  addPayrollPayment,
  editPayrollPayment,
  payPayrollPayment,
  payPensionPayrollPayment,
  cancelPayrollPayment,
  uploadPayrollPaymentFile,
  getPayrollPaymentDownloadUrl,
} from './payrollPaymentsClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddPayrollPayment,
  DownloadUrlResponse,
  EditPayrollPayment,
  ListPayrollPayments,
  PayPayrollPayment,
  PayPensionPayrollPayment,
} from '#/features/payroll-payments/schemas';

export function usePayrollPaymentsSuspense({
  pageNumber,
  pageSize,
  collaboratorId,
}: Partial<ListPayrollPayments> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    collaboratorId,
  };
  return useSuspenseQuery({
    queryKey: ['payroll-payments', params],
    queryFn: async () => {
      const token = await getToken();
      return listPayrollPayments(params, token);
    },
  });
}

export function usePayrollPaymentSuspense(payrollPaymentId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['payroll-payment', payrollPaymentId],
    queryFn: async () => {
      const token = await getToken();
      return getPayrollPayment(payrollPaymentId, token);
    },
  });
}

export function useAddPayrollPayment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddPayrollPayment) => {
      const token = await getToken();
      return addPayrollPayment(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-payments'] });
    },
  });
}

export function useEditPayrollPayment(payrollPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditPayrollPayment) => {
      const token = await getToken();
      return editPayrollPayment(payrollPaymentId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['payroll-payments'] });
      queryClient.setQueryData(['payroll-payment', payrollPaymentId], data);
    },
  });
}

export function usePayPayrollPayment(payrollPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: PayPayrollPayment) => {
      const token = await getToken();
      return payPayrollPayment(payrollPaymentId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['payroll-payments'] });
      queryClient.setQueryData(['payroll-payment', payrollPaymentId], data);
    },
  });
}

export function usePayPensionPayrollPayment(payrollPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: PayPensionPayrollPayment) => {
      const token = await getToken();
      return payPensionPayrollPayment(payrollPaymentId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['payroll-payments'] });
      queryClient.setQueryData(['payroll-payment', payrollPaymentId], data);
    },
  });
}

export function useCancelPayrollPayment(payrollPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return cancelPayrollPayment(payrollPaymentId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['payroll-payments'] });
      queryClient.setQueryData(['payroll-payment', payrollPaymentId], data);
    },
  });
}

export function useUploadPayrollPayment(payrollPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (file: File) => {
      const token = await getToken();
      return uploadPayrollPaymentFile(payrollPaymentId, file, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['payroll-payments'] });
      queryClient.setQueryData(['payroll-payment', payrollPaymentId], data);
    },
  });
}

export function usePayrollPaymentDownloadUrl(payrollPaymentId: string) {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (): Promise<DownloadUrlResponse> => {
      const token = await getToken();
      return getPayrollPaymentDownloadUrl(payrollPaymentId, token);
    },
  });
}
