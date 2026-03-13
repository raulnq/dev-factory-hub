import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listCollaboratorCharges,
  getCollaboratorCharge,
  addCollaboratorCharge,
  editCollaboratorCharge,
  payCollaboratorCharge,
  cancelCollaboratorCharge,
} from './collaboratorChargesClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddCollaboratorCharge,
  EditCollaboratorCharge,
  ListCollaboratorCharges,
  PayCollaboratorCharge,
} from '#/features/collaborator-charges/schemas';

export function useCollaboratorChargesSuspense({
  pageNumber,
  pageSize,
  collaboratorId,
}: Partial<ListCollaboratorCharges> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    collaboratorId,
  };
  return useSuspenseQuery({
    queryKey: ['collaborator-charges', params],
    queryFn: async () => {
      const token = await getToken();
      return listCollaboratorCharges(params, token);
    },
  });
}

export function useCollaboratorChargeSuspense(collaboratorChargeId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['collaborator-charge', collaboratorChargeId],
    queryFn: async () => {
      const token = await getToken();
      return getCollaboratorCharge(collaboratorChargeId, token);
    },
  });
}

export function useAddCollaboratorCharge() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddCollaboratorCharge) => {
      const token = await getToken();
      return addCollaboratorCharge(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-charges'] });
    },
  });
}

export function useEditCollaboratorCharge(collaboratorChargeId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditCollaboratorCharge) => {
      const token = await getToken();
      return editCollaboratorCharge(collaboratorChargeId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-charges'] });
      queryClient.setQueryData(
        ['collaborator-charge', collaboratorChargeId],
        data
      );
    },
  });
}

export function usePayCollaboratorCharge(collaboratorChargeId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: PayCollaboratorCharge) => {
      const token = await getToken();
      return payCollaboratorCharge(collaboratorChargeId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-charges'] });
      queryClient.setQueryData(
        ['collaborator-charge', collaboratorChargeId],
        data
      );
    },
  });
}

export function useCancelCollaboratorCharge(collaboratorChargeId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return cancelCollaboratorCharge(collaboratorChargeId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-charges'] });
      queryClient.setQueryData(
        ['collaborator-charge', collaboratorChargeId],
        data
      );
    },
  });
}
