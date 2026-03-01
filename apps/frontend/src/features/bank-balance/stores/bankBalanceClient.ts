import { client } from '@/client';
import type {
  BankBalance,
  ListBankBalance,
} from '#/features/bank-balance/schemas';

export async function getBankBalance(
  params: ListBankBalance,
  token?: string | null
): Promise<BankBalance> {
  const response = await client.api['bank-balance'].$get(
    {
      query: {
        currency: params.currency,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch bank balance'
    );
  }
  return response.json();
}
