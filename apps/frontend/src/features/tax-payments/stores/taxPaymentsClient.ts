import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  AddTaxPayment,
  EditTaxPayment,
  ListTaxPayments,
  PayTaxPayment,
  TaxPayment,
  TaxPaymentItem,
  AddTaxPaymentItem,
  ListTaxPaymentItems,
} from '#/features/tax-payments/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTaxPayment(item: any): TaxPayment {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    paidAt: item.paidAt ? new Date(item.paidAt) : null,
    cancelledAt: item.cancelledAt ? new Date(item.cancelledAt) : null,
  };
}

export async function listTaxPayments(
  params?: ListTaxPayments,
  token?: string | null
): Promise<Page<TaxPayment>> {
  const response = await client.api['tax-payments'].$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        year: params?.year?.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch tax payments');
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(mapTaxPayment),
  };
}

export async function getTaxPayment(
  taxPaymentId: string,
  token?: string | null
): Promise<TaxPayment> {
  const response = await client.api['tax-payments'][':taxPaymentId'].$get(
    { param: { taxPaymentId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch tax payment');
  }
  const item = await response.json();
  return mapTaxPayment(item);
}

export async function addTaxPayment(
  data: AddTaxPayment,
  token?: string | null
): Promise<TaxPayment> {
  const response = await client.api['tax-payments'].$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add tax payment');
  }
  const item = await response.json();
  return mapTaxPayment(item);
}

export async function editTaxPayment(
  taxPaymentId: string,
  data: EditTaxPayment,
  token?: string | null
): Promise<TaxPayment> {
  const response = await client.api['tax-payments'][':taxPaymentId'].$put(
    { param: { taxPaymentId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update tax payment');
  }
  const item = await response.json();
  return mapTaxPayment(item);
}

export async function payTaxPayment(
  taxPaymentId: string,
  data: PayTaxPayment,
  token?: string | null
): Promise<TaxPayment> {
  const response = await client.api['tax-payments'][':taxPaymentId'].pay.$post(
    { param: { taxPaymentId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to pay tax payment');
  }
  const item = await response.json();
  return mapTaxPayment(item);
}

export async function cancelTaxPayment(
  taxPaymentId: string,
  token?: string | null
): Promise<TaxPayment> {
  const response = await client.api['tax-payments'][
    ':taxPaymentId'
  ].cancel.$post(
    { param: { taxPaymentId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel tax payment');
  }
  const item = await response.json();
  return mapTaxPayment(item);
}

export async function listTaxPaymentItems(
  taxPaymentId: string,
  params: ListTaxPaymentItems,
  token?: string | null
): Promise<Page<TaxPaymentItem>> {
  const response = await client.api['tax-payments'][':taxPaymentId'].items.$get(
    {
      param: { taxPaymentId },
      query: {
        pageNumber: params.pageNumber.toString(),
        pageSize: params.pageSize.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch tax payment items');
  }
  return response.json() as Promise<Page<TaxPaymentItem>>;
}

export async function addTaxPaymentItem(
  taxPaymentId: string,
  data: AddTaxPaymentItem,
  token?: string | null
): Promise<TaxPaymentItem> {
  const response = await client.api['tax-payments'][
    ':taxPaymentId'
  ].items.$post(
    { param: { taxPaymentId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add tax payment item');
  }
  return response.json() as Promise<TaxPaymentItem>;
}

export async function deleteTaxPaymentItem(
  taxPaymentId: string,
  taxPaymentItemId: string,
  token?: string | null
): Promise<void> {
  const response = await client.api['tax-payments'][':taxPaymentId'].items[
    ':taxPaymentItemId'
  ].$delete(
    { param: { taxPaymentId, taxPaymentItemId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete tax payment item');
  }
}
