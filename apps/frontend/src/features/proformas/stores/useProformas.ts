import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listProformas,
  getProforma,
  addProforma,
  editProforma,
  issueProforma,
  cancelProforma,
  listProformaItems,
  addProformaItem,
  deleteProformaItem,
} from './proformasClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddProforma,
  EditProforma,
  ListProforma,
  AddProformaItem,
} from '#/features/proformas/schemas';

export function useProformasSuspense({
  pageNumber,
  pageSize,
  projectId,
}: Partial<ListProforma> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    projectId,
  };
  return useSuspenseQuery({
    queryKey: ['proformas', params],
    queryFn: async () => {
      const token = await getToken();
      return listProformas(params, token);
    },
  });
}

export function useProformaSuspense(proformaId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['proforma', proformaId],
    queryFn: async () => {
      const token = await getToken();
      return getProforma(proformaId, token);
    },
  });
}

export function useAddProforma() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddProforma) => {
      const token = await getToken();
      return addProforma(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
    },
  });
}

export function useEditProforma(proformaId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditProforma) => {
      const token = await getToken();
      return editProforma(proformaId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
      queryClient.setQueryData(['proforma', proformaId], data);
    },
  });
}

export function useIssueProforma(proformaId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return issueProforma(proformaId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
      queryClient.setQueryData(['proforma', proformaId], data);
    },
  });
}

export function useCancelProforma(proformaId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return cancelProforma(proformaId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
      queryClient.setQueryData(['proforma', proformaId], data);
    },
  });
}

export function useProformaItemsSuspense({
  proformaId,
  pageNumber = 1,
  pageSize = 5,
}: {
  proformaId: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  const { getToken } = useAuth();
  const params = { pageNumber, pageSize };
  return useSuspenseQuery({
    queryKey: ['proforma-items', proformaId, params],
    queryFn: async () => {
      const token = await getToken();
      return listProformaItems(proformaId, params, token);
    },
  });
}

export function useAddProformaItem(proformaId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddProformaItem) => {
      const token = await getToken();
      return addProformaItem(proformaId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['proforma-items', proformaId],
      });
      queryClient.invalidateQueries({ queryKey: ['proforma', proformaId] });
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
    },
  });
}

export function useDeleteProformaItem(proformaId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (proformaItemId: string) => {
      const token = await getToken();
      return deleteProformaItem(proformaId, proformaItemId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['proforma-items', proformaId],
      });
      queryClient.invalidateQueries({ queryKey: ['proforma', proformaId] });
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
    },
  });
}
