import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listClients,
  getClient,
  addClient,
  editClient,
  listProjects,
  addProject,
  editProject,
  deleteProject,
  listContacts,
  addContact,
  editContact,
  deleteContact,
  listAllProjects,
} from './clientsClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddClient,
  EditClient,
  ListClients,
  AddProject,
  EditProject,
  AddContact,
  EditContact,
} from '#/features/clients/schemas';

export function useClientsSuspense({
  pageNumber,
  pageSize,
  name,
}: Partial<ListClients> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    name,
  };
  return useSuspenseQuery({
    queryKey: ['clients', params],
    queryFn: async () => {
      const token = await getToken();
      return listClients(params, token);
    },
  });
}

export function useClientSuspense(clientId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const token = await getToken();
      return getClient(clientId, token);
    },
  });
}

export function useAddClient() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddClient) => {
      const token = await getToken();
      return addClient(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useEditClient(clientId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditClient) => {
      const token = await getToken();
      return editClient(clientId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.setQueryData(['client', clientId], data);
    },
  });
}

export function useProjectsSuspense(
  clientId: string,
  pageNumber: number = 1,
  pageSize: number = 5
) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['projects', clientId, pageNumber, pageSize],
    queryFn: async () => {
      const token = await getToken();
      return listProjects(clientId, pageNumber, pageSize, token);
    },
  });
}

export function useProjects({
  clientId,
  name,
  enabled,
  pageNumber = 1,
  pageSize = 10,
}: {
  clientId?: string;
  name?: string;
  enabled: boolean;
  pageNumber?: number;
  pageSize?: number;
}) {
  const { getToken } = useAuth();
  const params = { pageNumber, pageSize, name, clientId };
  return useQuery({
    queryKey: ['projects-search', params],
    queryFn: async () => {
      const token = await getToken();
      return listAllProjects(params, token);
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useAddProject(clientId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddProject) => {
      const token = await getToken();
      return addProject(clientId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', clientId] });
    },
  });
}

export function useEditProject(clientId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      projectId,
      data,
    }: {
      projectId: string;
      data: EditProject;
    }) => {
      const token = await getToken();
      return editProject(clientId, projectId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', clientId] });
    },
  });
}

export function useDeleteProject(clientId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      const token = await getToken();
      return deleteProject(clientId, projectId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', clientId] });
    },
  });
}

export function useContactsSuspense(
  clientId: string,
  pageNumber: number = 1,
  pageSize: number = 5
) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['contacts', clientId, pageNumber, pageSize],
    queryFn: async () => {
      const token = await getToken();
      return listContacts(clientId, pageNumber, pageSize, token);
    },
  });
}

export function useAddContact(clientId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddContact) => {
      const token = await getToken();
      return addContact(clientId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId] });
    },
  });
}

export function useEditContact(clientId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      contactId,
      data,
    }: {
      contactId: string;
      data: EditContact;
    }) => {
      const token = await getToken();
      return editContact(clientId, contactId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId] });
    },
  });
}

export function useDeleteContact(clientId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({ contactId }: { contactId: string }) => {
      const token = await getToken();
      return deleteContact(clientId, contactId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId] });
    },
  });
}
