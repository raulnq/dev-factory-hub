import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  AddMoneyExchange,
  DownloadUrlResponse,
  EditMoneyExchange,
  IssueMoneyExchange,
  ListMoneyExchanges,
  MoneyExchange,
} from '#/features/money-exchanges/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMoneyExchange(item: any): MoneyExchange {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
  };
}

export async function listMoneyExchanges(
  params?: Partial<ListMoneyExchanges>,
  token?: string | null
): Promise<Page<MoneyExchange>> {
  const response = await client.api['money-exchanges'].$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        fromCurrency: params?.fromCurrency,
        toCurrency: params?.toCurrency,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch money exchanges'
    );
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(mapMoneyExchange),
  };
}

export async function getMoneyExchange(
  moneyExchangeId: string,
  token?: string | null
): Promise<MoneyExchange> {
  const response = await client.api['money-exchanges'][':moneyExchangeId'].$get(
    { param: { moneyExchangeId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch money exchange'
    );
  }
  const item = await response.json();
  return mapMoneyExchange(item);
}

export async function addMoneyExchange(
  data: AddMoneyExchange,
  token?: string | null
): Promise<MoneyExchange> {
  const response = await client.api['money-exchanges'].$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to add money exchange'
    );
  }
  const item = await response.json();
  return mapMoneyExchange(item);
}

export async function editMoneyExchange(
  moneyExchangeId: string,
  data: EditMoneyExchange,
  token?: string | null
): Promise<MoneyExchange> {
  const response = await client.api['money-exchanges'][':moneyExchangeId'].$put(
    { param: { moneyExchangeId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to update money exchange'
    );
  }
  const item = await response.json();
  return mapMoneyExchange(item);
}

export async function issueMoneyExchange(
  moneyExchangeId: string,
  data: IssueMoneyExchange,
  token?: string | null
): Promise<MoneyExchange> {
  const response = await client.api['money-exchanges'][
    ':moneyExchangeId'
  ].issue.$post(
    { param: { moneyExchangeId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to issue money exchange'
    );
  }
  const item = await response.json();
  return mapMoneyExchange(item);
}

export async function cancelMoneyExchange(
  moneyExchangeId: string,
  token?: string | null
): Promise<MoneyExchange> {
  const response = await client.api['money-exchanges'][
    ':moneyExchangeId'
  ].cancel.$post(
    { param: { moneyExchangeId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to cancel money exchange'
    );
  }
  const item = await response.json();
  return mapMoneyExchange(item);
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function uploadMoneyExchangeFile(
  moneyExchangeId: string,
  file: File,
  token?: string | null
): Promise<MoneyExchange> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(
    `${API_BASE_URL}/api/money-exchanges/${moneyExchangeId}/upload`,
    {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to upload file'
    );
  }
  const result = await response.json();
  return mapMoneyExchange(result);
}

export async function getMoneyExchangeDownloadUrl(
  moneyExchangeId: string,
  token?: string | null
): Promise<DownloadUrlResponse> {
  const response = await client.api['money-exchanges'][':moneyExchangeId'][
    'download-url'
  ].$get(
    { param: { moneyExchangeId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to get download URL'
    );
  }
  return response.json();
}
