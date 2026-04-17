import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  AddInvoice,
  DownloadUrlResponse,
  EditInvoice,
  Invoice,
  IssueInvoice,
  ListInvoices,
} from '#/features/invoices/schemas';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInvoice(item: any): Invoice {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
  };
}

export async function listInvoices(
  params?: ListInvoices,
  token?: string | null
): Promise<Page<Invoice>> {
  const response = await client.api.invoices.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        clientId: params?.clientId,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch invoices');
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(mapInvoice),
  };
}

export async function getInvoice(
  invoiceId: string,
  token?: string | null
): Promise<Invoice> {
  const response = await client.api.invoices[':invoiceId'].$get(
    { param: { invoiceId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch invoice');
  }
  const item = await response.json();
  return mapInvoice(item);
}

export async function addInvoice(
  data: AddInvoice,
  token?: string | null
): Promise<Invoice> {
  const response = await client.api.invoices.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add invoice');
  }
  const item = await response.json();
  return mapInvoice(item);
}

export async function editInvoice(
  invoiceId: string,
  data: EditInvoice,
  token?: string | null
): Promise<Invoice> {
  const response = await client.api.invoices[':invoiceId'].$put(
    {
      param: { invoiceId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update invoice');
  }
  const item = await response.json();
  return mapInvoice(item);
}

export async function issueInvoice(
  invoiceId: string,
  data: IssueInvoice,
  token?: string | null
): Promise<Invoice> {
  const response = await client.api.invoices[':invoiceId'].issue.$post(
    { param: { invoiceId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to issue invoice');
  }
  const item = await response.json();
  return mapInvoice(item);
}

export async function cancelInvoice(
  invoiceId: string,
  token?: string | null
): Promise<Invoice> {
  const response = await client.api.invoices[':invoiceId'].cancel.$post(
    { param: { invoiceId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel invoice');
  }
  const item = await response.json();
  return mapInvoice(item);
}

export async function uploadInvoiceFile(
  invoiceId: string,
  file: File,
  token?: string | null
): Promise<Invoice> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(
    `${API_BASE_URL}/api/invoices/${invoiceId}/upload`,
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
  return mapInvoice(result);
}

export async function getInvoiceDownloadUrl(
  invoiceId: string,
  token?: string | null
): Promise<DownloadUrlResponse> {
  const response = await client.api.invoices[':invoiceId']['download-url'].$get(
    { param: { invoiceId } },
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
