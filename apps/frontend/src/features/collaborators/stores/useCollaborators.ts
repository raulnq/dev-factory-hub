import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listCollaborators,
  getCollaborator,
  addCollaborator,
  editCollaborator,
} from './collaboratorsClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddCollaborator,
  EditCollaborator,
  ListCollaborators,
} from '#/features/collaborators/schemas';

export function useCollaboratorsSuspense({
  pageNumber,
  pageSize,
  name,
}: Partial<ListCollaborators> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    name,
  };
  return useSuspenseQuery({
    queryKey: ['collaborators', params],
    queryFn: async () => {
      const token = await getToken();
      return listCollaborators(params, token);
    },
  });
}

export function useCollaboratorSuspense(collaboratorId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['collaborator', collaboratorId],
    queryFn: async () => {
      const token = await getToken();
      return getCollaborator(collaboratorId, token);
    },
  });
}

export function useAddCollaborator() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddCollaborator) => {
      const token = await getToken();
      return addCollaborator(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
    },
  });
}

export function useEditCollaborator(collaboratorId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditCollaborator) => {
      const token = await getToken();
      return editCollaborator(collaboratorId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      queryClient.setQueryData(['collaborator', collaboratorId], data);
    },
  });
}
