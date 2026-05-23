import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { listDocumentStatus, sendMonthlyStatement } from './reportsClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  ListDocumentStatus,
  SendMonthlyStatement,
} from '#/features/reports/schemas';

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

export function useSendMonthlyStatement() {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: SendMonthlyStatement) => {
      const token = await getToken();
      return sendMonthlyStatement(data, token);
    },
  });
}
