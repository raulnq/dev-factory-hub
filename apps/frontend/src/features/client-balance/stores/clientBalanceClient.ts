import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  ClientBalance,
  ClientBalanceSummary,
  ClientBalanceSummaryQuery,
  ListClientBalance,
} from '#/features/client-balance/schemas';

export async function getClientBalanceSummary(
  params: ClientBalanceSummaryQuery,
  token?: string | null
): Promise<Page<ClientBalanceSummary[number]>> {
  const response = await client.api['client-balance'].summary.$get(
    {
      query: {
        currency: params.currency,
        clientId: params.clientId as string | string[] | undefined,
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
        'Failed to fetch client balance summary'
    );
  }
  return response.json() as Promise<Page<ClientBalanceSummary[number]>>;
}

export async function getClientBalance(
  params: ListClientBalance,
  token?: string | null
): Promise<ClientBalance> {
  const response = await client.api['client-balance'].$get(
    {
      query: {
        currency: params.currency,
        clientId: params.clientId,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch client balance'
    );
  }
  return response.json() as Promise<ClientBalance>;
}
