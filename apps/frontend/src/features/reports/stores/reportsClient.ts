import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  DocumentStatusItem,
  ListDocumentStatus,
} from '#/features/reports/schemas';

export async function listDocumentStatus(
  params: Pick<ListDocumentStatus, 'month' | 'year'> &
    Partial<Pick<ListDocumentStatus, 'pageNumber' | 'pageSize'>>,
  token?: string | null
): Promise<Page<DocumentStatusItem>> {
  const response = await client.api.reports['document-status'].$get(
    {
      query: {
        month: params.month.toString(),
        year: params.year.toString(),
        pageNumber: params.pageNumber?.toString(),
        pageSize: params.pageSize?.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail ||
        'Failed to fetch document status report'
    );
  }
  return response.json();
}
