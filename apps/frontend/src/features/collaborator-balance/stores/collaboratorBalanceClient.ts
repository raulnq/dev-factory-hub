import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  CollaboratorBalance,
  CollaboratorBalanceSummary,
  CollaboratorBalanceSummaryQuery,
  ListCollaboratorBalance,
} from '#/features/collaborator-balance/schemas';

export async function getCollaboratorBalanceSummary(
  params: CollaboratorBalanceSummaryQuery,
  token?: string | null
): Promise<Page<CollaboratorBalanceSummary[number]>> {
  const response = await client.api['collaborator-balance'].summary.$get(
    {
      query: {
        currency: params.currency,
        collaboratorId: params.collaboratorId as string | string[] | undefined,
        date: params.date,
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
        'Failed to fetch collaborator balance summary'
    );
  }
  return response.json() as Promise<Page<CollaboratorBalanceSummary[number]>>;
}

export async function getCollaboratorBalance(
  params: ListCollaboratorBalance,
  token?: string | null
): Promise<CollaboratorBalance> {
  const response = await client.api['collaborator-balance'].$get(
    {
      query: {
        currency: params.currency,
        collaboratorId: params.collaboratorId,
        startDate: params.startDate,
        endDate: params.endDate,
        exchangeCurrencyTo: params.exchangeCurrencyTo,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail ||
        'Failed to fetch collaborator balance'
    );
  }
  return response.json();
}
