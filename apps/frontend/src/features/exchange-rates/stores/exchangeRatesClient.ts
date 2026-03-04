import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  AddExchangeRate,
  EditExchangeRate,
  ExchangeRate,
  ListExchangeRates,
} from '#/features/exchange-rates/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapExchangeRate(item: any): ExchangeRate {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
  };
}

export async function listExchangeRates(
  params?: ListExchangeRates,
  token?: string | null
): Promise<Page<ExchangeRate>> {
  const response = await client.api['exchange-rates'].$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        fromCurrency: params?.fromCurrency,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch exchange rates'
    );
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(mapExchangeRate),
  };
}

export async function getExchangeRate(
  exchangeRateId: string,
  token?: string | null
): Promise<ExchangeRate> {
  const response = await client.api['exchange-rates'][':exchangeRateId'].$get(
    { param: { exchangeRateId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch exchange rate'
    );
  }
  const item = await response.json();
  return mapExchangeRate(item);
}

export async function addExchangeRate(
  data: AddExchangeRate,
  token?: string | null
): Promise<ExchangeRate> {
  const response = await client.api['exchange-rates'].$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to add exchange rate'
    );
  }
  const item = await response.json();
  return mapExchangeRate(item);
}

export async function editExchangeRate(
  exchangeRateId: string,
  data: EditExchangeRate,
  token?: string | null
): Promise<ExchangeRate> {
  const response = await client.api['exchange-rates'][':exchangeRateId'].$put(
    { param: { exchangeRateId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to update exchange rate'
    );
  }
  const item = await response.json();
  return mapExchangeRate(item);
}
