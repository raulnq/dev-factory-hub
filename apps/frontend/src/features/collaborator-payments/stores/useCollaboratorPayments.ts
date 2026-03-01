import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listCollaboratorPayments,
  getCollaboratorPayment,
  addCollaboratorPayment,
  editCollaboratorPayment,
  payCollaboratorPayment,
  confirmCollaboratorPayment,
  cancelCollaboratorPayment,
} from './collaboratorPaymentsClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddCollaboratorPayment,
  ConfirmCollaboratorPayment,
  EditCollaboratorPayment,
  ListCollaboratorPayments,
  PayCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';

export function useCollaboratorPaymentsSuspense({
  pageNumber,
  pageSize,
  collaboratorId,
}: Partial<ListCollaboratorPayments> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    collaboratorId,
  };
  return useSuspenseQuery({
    queryKey: ['collaborator-payments', params],
    queryFn: async () => {
      const token = await getToken();
      return listCollaboratorPayments(params, token);
    },
  });
}

export function useCollaboratorPaymentSuspense(collaboratorPaymentId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['collaborator-payment', collaboratorPaymentId],
    queryFn: async () => {
      const token = await getToken();
      return getCollaboratorPayment(collaboratorPaymentId, token);
    },
  });
}

export function useAddCollaboratorPayment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddCollaboratorPayment) => {
      const token = await getToken();
      return addCollaboratorPayment(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-payments'] });
    },
  });
}

export function useEditCollaboratorPayment(collaboratorPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditCollaboratorPayment) => {
      const token = await getToken();
      return editCollaboratorPayment(collaboratorPaymentId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-payments'] });
      queryClient.setQueryData(
        ['collaborator-payment', collaboratorPaymentId],
        data
      );
    },
  });
}

export function usePayCollaboratorPayment(collaboratorPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: PayCollaboratorPayment) => {
      const token = await getToken();
      return payCollaboratorPayment(collaboratorPaymentId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-payments'] });
      queryClient.setQueryData(
        ['collaborator-payment', collaboratorPaymentId],
        data
      );
    },
  });
}

export function useConfirmCollaboratorPayment(collaboratorPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: ConfirmCollaboratorPayment) => {
      const token = await getToken();
      return confirmCollaboratorPayment(collaboratorPaymentId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-payments'] });
      queryClient.setQueryData(
        ['collaborator-payment', collaboratorPaymentId],
        data
      );
    },
  });
}

export function useCancelCollaboratorPayment(collaboratorPaymentId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return cancelCollaboratorPayment(collaboratorPaymentId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-payments'] });
      queryClient.setQueryData(
        ['collaborator-payment', collaboratorPaymentId],
        data
      );
    },
  });
}
