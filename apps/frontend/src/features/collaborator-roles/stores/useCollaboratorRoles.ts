import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listCollaboratorRoles,
  getCollaboratorRole,
  addCollaboratorRole,
  editCollaboratorRole,
} from './collaboratorRolesClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddCollaboratorRole,
  EditCollaboratorRole,
  ListCollaboratorRoles,
} from '#/features/collaborator-roles/schemas';

export function useCollaboratorRoles(search: string, enabled: boolean) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['collaborator-roles-search', search],
    queryFn: async () => {
      const token = await getToken();
      return listCollaboratorRoles(
        { pageNumber: 1, pageSize: 100, name: search || undefined },
        token
      );
    },
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCollaboratorRolesSuspense({
  pageNumber,
  pageSize,
  name,
}: Partial<ListCollaboratorRoles> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    name,
  };
  return useSuspenseQuery({
    queryKey: ['collaborator-roles', params],
    queryFn: async () => {
      const token = await getToken();
      return listCollaboratorRoles(params, token);
    },
  });
}

export function useCollaboratorRoleSuspense(collaboratorRoleId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['collaborator-role', collaboratorRoleId],
    queryFn: async () => {
      const token = await getToken();
      return getCollaboratorRole(collaboratorRoleId, token);
    },
  });
}

export function useAddCollaboratorRole() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddCollaboratorRole) => {
      const token = await getToken();
      return addCollaboratorRole(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-roles'] });
    },
  });
}

export function useEditCollaboratorRole(collaboratorRoleId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditCollaboratorRole) => {
      const token = await getToken();
      return editCollaboratorRole(collaboratorRoleId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-roles'] });
      queryClient.setQueryData(['collaborator-role', collaboratorRoleId], data);
    },
  });
}
