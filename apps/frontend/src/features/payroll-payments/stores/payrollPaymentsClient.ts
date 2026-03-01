import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  AddPayrollPayment,
  DownloadUrlResponse,
  EditPayrollPayment,
  ListPayrollPayments,
  PayPayrollPayment,
  PayPensionPayrollPayment,
  PayrollPayment,
} from '#/features/payroll-payments/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPayrollPayment(item: any): PayrollPayment {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
  };
}

export async function listPayrollPayments(
  params?: Partial<ListPayrollPayments>,
  token?: string | null
): Promise<Page<PayrollPayment>> {
  const response = await client.api['payroll-payments'].$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        collaboratorId: params?.collaboratorId,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail ||
        'Failed to fetch payroll payments'
    );
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(mapPayrollPayment),
  };
}

export async function getPayrollPayment(
  payrollPaymentId: string,
  token?: string | null
): Promise<PayrollPayment> {
  const response = await client.api['payroll-payments'][
    ':payrollPaymentId'
  ].$get(
    { param: { payrollPaymentId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch payroll payment'
    );
  }
  const item = await response.json();
  return mapPayrollPayment(item);
}

export async function addPayrollPayment(
  data: AddPayrollPayment,
  token?: string | null
): Promise<PayrollPayment> {
  const response = await client.api['payroll-payments'].$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to add payroll payment'
    );
  }
  const item = await response.json();
  return mapPayrollPayment(item);
}

export async function editPayrollPayment(
  payrollPaymentId: string,
  data: EditPayrollPayment,
  token?: string | null
): Promise<PayrollPayment> {
  const response = await client.api['payroll-payments'][
    ':payrollPaymentId'
  ].$put(
    { param: { payrollPaymentId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail ||
        'Failed to update payroll payment'
    );
  }
  const item = await response.json();
  return mapPayrollPayment(item);
}

export async function payPayrollPayment(
  payrollPaymentId: string,
  data: PayPayrollPayment,
  token?: string | null
): Promise<PayrollPayment> {
  const response = await client.api['payroll-payments'][
    ':payrollPaymentId'
  ].pay.$post(
    { param: { payrollPaymentId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to pay payroll payment'
    );
  }
  const item = await response.json();
  return mapPayrollPayment(item);
}

export async function payPensionPayrollPayment(
  payrollPaymentId: string,
  data: PayPensionPayrollPayment,
  token?: string | null
): Promise<PayrollPayment> {
  const response = await client.api['payroll-payments'][':payrollPaymentId'][
    'pay-pension'
  ].$post(
    { param: { payrollPaymentId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail ||
        'Failed to pay pension for payroll payment'
    );
  }
  const item = await response.json();
  return mapPayrollPayment(item);
}

export async function cancelPayrollPayment(
  payrollPaymentId: string,
  token?: string | null
): Promise<PayrollPayment> {
  const response = await client.api['payroll-payments'][
    ':payrollPaymentId'
  ].cancel.$post(
    { param: { payrollPaymentId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail ||
        'Failed to cancel payroll payment'
    );
  }
  const item = await response.json();
  return mapPayrollPayment(item);
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function uploadPayrollPaymentFile(
  payrollPaymentId: string,
  file: File,
  token?: string | null
): Promise<PayrollPayment> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(
    `${API_BASE_URL}/api/payroll-payments/${payrollPaymentId}/upload`,
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
  return mapPayrollPayment(result);
}

export async function getPayrollPaymentDownloadUrl(
  payrollPaymentId: string,
  token?: string | null
): Promise<DownloadUrlResponse> {
  const response = await client.api['payroll-payments'][':payrollPaymentId'][
    'download-url'
  ].$get(
    { param: { payrollPaymentId } },
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
