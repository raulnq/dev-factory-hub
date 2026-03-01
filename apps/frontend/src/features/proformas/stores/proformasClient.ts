import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  AddProforma,
  EditProforma,
  Proforma,
  ProformaItem,
  AddProformaItem,
  ListProforma,
  ListProformaItems,
} from '#/features/proformas/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProforma(item: any): Proforma {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    issuedAt: item.issuedAt ? new Date(item.issuedAt) : null,
    cancelledAt: item.cancelledAt ? new Date(item.cancelledAt) : null,
  };
}

export async function listProformas(
  params?: ListProforma,
  token?: string | null
): Promise<Page<Proforma>> {
  const response = await client.api.proformas.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        projectId: params?.projectId,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch proformas');
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(mapProforma),
  };
}

export async function getProforma(
  proformaId: string,
  token?: string | null
): Promise<Proforma> {
  const response = await client.api.proformas[':proformaId'].$get(
    { param: { proformaId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch proforma');
  }
  const item = await response.json();
  return mapProforma(item);
}

export async function addProforma(
  data: AddProforma,
  token?: string | null
): Promise<Proforma> {
  const response = await client.api.proformas.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add proforma');
  }
  const item = await response.json();
  return mapProforma(item);
}

export async function editProforma(
  proformaId: string,
  data: EditProforma,
  token?: string | null
): Promise<Proforma> {
  const response = await client.api.proformas[':proformaId'].$put(
    {
      param: { proformaId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update proforma');
  }
  const item = await response.json();
  return mapProforma(item);
}

export async function issueProforma(
  proformaId: string,
  token?: string | null
): Promise<Proforma> {
  const response = await client.api.proformas[':proformaId'].issue.$post(
    { param: { proformaId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to issue proforma');
  }
  const item = await response.json();
  return mapProforma(item);
}

export async function cancelProforma(
  proformaId: string,
  token?: string | null
): Promise<Proforma> {
  const response = await client.api.proformas[':proformaId'].cancel.$post(
    { param: { proformaId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel proforma');
  }
  const item = await response.json();
  return mapProforma(item);
}

export async function listProformaItems(
  proformaId: string,
  params: ListProformaItems,
  token?: string | null
): Promise<Page<ProformaItem>> {
  const response = await client.api.proformas[':proformaId'].items.$get(
    {
      param: { proformaId },
      query: {
        pageNumber: params.pageNumber.toString(),
        pageSize: params.pageSize.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch proforma items');
  }
  return response.json() as Promise<Page<ProformaItem>>;
}

export async function addProformaItem(
  proformaId: string,
  data: AddProformaItem,
  token?: string | null
): Promise<ProformaItem> {
  const response = await client.api.proformas[':proformaId'].items.$post(
    {
      param: { proformaId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add proforma item');
  }
  return response.json() as Promise<ProformaItem>;
}

export async function deleteProformaItem(
  proformaId: string,
  proformaItemId: string,
  token?: string | null
): Promise<void> {
  const response = await client.api.proformas[':proformaId'].items[
    ':proformaItemId'
  ].$delete(
    { param: { proformaId, proformaItemId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete proforma item');
  }
}
