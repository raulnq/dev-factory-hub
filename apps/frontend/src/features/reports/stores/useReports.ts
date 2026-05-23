import { useSuspenseQuery } from '@tanstack/react-query';
import { listDocumentStatus } from './reportsClient';
import { useAuth } from '@clerk/clerk-react';
import type { ListDocumentStatus } from '#/features/reports/schemas';

export function useDocumentStatusSuspense(
  params: Pick<ListDocumentStatus, 'month' | 'year'> &
    Partial<Pick<ListDocumentStatus, 'pageNumber' | 'pageSize'>>
) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['document-status', params],
    queryFn: async () => {
      const token = await getToken();
      return listDocumentStatus(params, token);
    },
  });
}
