import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  BankBalance,
  BankBalanceSummary,
  BankBalanceSummaryQuery,
  ListBankBalance,
} from '#/features/bank-balance/schemas';

export async function getBankBalanceSummary(
  params: BankBalanceSummaryQuery,
  token?: string | null
): Promise<Page<BankBalanceSummary[number]>> {
  const response = await client.api['bank-balance'].summary.$get(
    {
      query: {
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
        'Failed to fetch bank balance summary'
    );
  }
  return response.json() as Promise<Page<BankBalanceSummary[number]>>;
}

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
