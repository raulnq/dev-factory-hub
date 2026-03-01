import { client } from '@/client';
import type {
  ClientBalance,
  ListClientBalance,
} from '#/features/client-balance/schemas';

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
  return response.json();
}
