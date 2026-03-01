import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  AddTransaction,
  DownloadUrlResponse,
  EditTransaction,
  IssueTransaction,
  ListTransactions,
  Transaction,
} from '#/features/transactions/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTransaction(item: any): Transaction {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
  };
}

export async function listTransactions(
  params?: Partial<ListTransactions>,
  token?: string | null
): Promise<Page<Transaction>> {
  const response = await client.api.transactions.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        type: params?.type,
        description: params?.description,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch transactions'
    );
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(mapTransaction),
  };
}

export async function getTransaction(
  transactionId: string,
  token?: string | null
): Promise<Transaction> {
  const response = await client.api.transactions[':transactionId'].$get(
    { param: { transactionId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch transaction'
    );
  }
  const item = await response.json();
  return mapTransaction(item);
}

export async function addTransaction(
  data: AddTransaction,
  token?: string | null
): Promise<Transaction> {
  const response = await client.api.transactions.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to add transaction'
    );
  }
  const item = await response.json();
  return mapTransaction(item);
}

export async function editTransaction(
  transactionId: string,
  data: EditTransaction,
  token?: string | null
): Promise<Transaction> {
  const response = await client.api.transactions[':transactionId'].$put(
    { param: { transactionId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to update transaction'
    );
  }
  const item = await response.json();
  return mapTransaction(item);
}

export async function issueTransaction(
  transactionId: string,
  data: IssueTransaction,
  token?: string | null
): Promise<Transaction> {
  const response = await client.api.transactions[':transactionId'].issue.$post(
    { param: { transactionId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to issue transaction'
    );
  }
  const item = await response.json();
  return mapTransaction(item);
}

export async function cancelTransaction(
  transactionId: string,
  token?: string | null
): Promise<Transaction> {
  const response = await client.api.transactions[':transactionId'].cancel.$post(
    { param: { transactionId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to cancel transaction'
    );
  }
  const item = await response.json();
  return mapTransaction(item);
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function uploadTransactionFile(
  transactionId: string,
  file: File,
  token?: string | null
): Promise<Transaction> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/${transactionId}/upload`,
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
  return mapTransaction(result);
}

export async function getTransactionDownloadUrl(
  transactionId: string,
  token?: string | null
): Promise<DownloadUrlResponse> {
  const response = await client.api.transactions[':transactionId'][
    'download-url'
  ].$get(
    { param: { transactionId } },
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
