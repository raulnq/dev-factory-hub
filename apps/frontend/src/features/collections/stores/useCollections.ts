import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listCollections,
  getCollection,
  addCollection,
  editCollection,
  confirmCollection,
  cancelCollection,
  uploadCollectionFile,
  getCollectionDownloadUrl,
} from './collectionsClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddCollection,
  ConfirmCollection,
  EditCollection,
  ListCollections,
} from '#/features/collections/schemas';

export function useCollectionsSuspense({
  pageNumber,
  pageSize,
  clientId,
}: Partial<ListCollections> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    clientId,
  };
  return useSuspenseQuery({
    queryKey: ['collections', params],
    queryFn: async () => {
      const token = await getToken();
      return listCollections(params, token);
    },
  });
}

export function useCollectionSuspense(collectionId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const token = await getToken();
      return getCollection(collectionId, token);
    },
  });
}

export function useAddCollection() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddCollection) => {
      const token = await getToken();
      return addCollection(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useEditCollection(collectionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditCollection) => {
      const token = await getToken();
      return editCollection(collectionId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.setQueryData(['collection', collectionId], data);
    },
  });
}

export function useConfirmCollection(collectionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: ConfirmCollection) => {
      const token = await getToken();
      return confirmCollection(collectionId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.setQueryData(['collection', collectionId], data);
    },
  });
}

export function useCancelCollection(collectionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return cancelCollection(collectionId, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.setQueryData(['collection', collectionId], data);
    },
  });
}

export function useUploadCollection(collectionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (file: File) => {
      const token = await getToken();
      return uploadCollectionFile(collectionId, file, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.setQueryData(['collection', collectionId], data);
    },
  });
}

export function useCollectionDownloadUrl(collectionId: string) {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return getCollectionDownloadUrl(collectionId, token);
    },
  });
}
