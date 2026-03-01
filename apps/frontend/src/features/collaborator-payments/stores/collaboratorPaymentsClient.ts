import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  AddCollaboratorPayment,
  CollaboratorPayment,
  ConfirmCollaboratorPayment,
  EditCollaboratorPayment,
  ListCollaboratorPayments,
  PayCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCollaboratorPayment(item: any): CollaboratorPayment {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
  };
}

export async function listCollaboratorPayments(
  params?: ListCollaboratorPayments,
  token?: string | null
): Promise<Page<CollaboratorPayment>> {
  const response = await client.api['collaborator-payments'].$get(
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
    throw new Error(error.detail || 'Failed to fetch collaborator payments');
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(mapCollaboratorPayment),
  };
}

export async function getCollaboratorPayment(
  collaboratorPaymentId: string,
  token?: string | null
): Promise<CollaboratorPayment> {
  const response = await client.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].$get(
    { param: { collaboratorPaymentId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch collaborator payment');
  }
  const item = await response.json();
  return mapCollaboratorPayment(item);
}

export async function addCollaboratorPayment(
  data: AddCollaboratorPayment,
  token?: string | null
): Promise<CollaboratorPayment> {
  const response = await client.api['collaborator-payments'].$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add collaborator payment');
  }
  const item = await response.json();
  return mapCollaboratorPayment(item);
}

export async function editCollaboratorPayment(
  collaboratorPaymentId: string,
  data: EditCollaboratorPayment,
  token?: string | null
): Promise<CollaboratorPayment> {
  const response = await client.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].$put(
    {
      param: { collaboratorPaymentId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update collaborator payment');
  }
  const item = await response.json();
  return mapCollaboratorPayment(item);
}

export async function payCollaboratorPayment(
  collaboratorPaymentId: string,
  data: PayCollaboratorPayment,
  token?: string | null
): Promise<CollaboratorPayment> {
  const response = await client.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].pay.$post(
    { param: { collaboratorPaymentId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to pay collaborator payment');
  }
  const item = await response.json();
  return mapCollaboratorPayment(item);
}

export async function confirmCollaboratorPayment(
  collaboratorPaymentId: string,
  data: ConfirmCollaboratorPayment,
  token?: string | null
): Promise<CollaboratorPayment> {
  const response = await client.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].confirm.$post(
    { param: { collaboratorPaymentId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to confirm collaborator payment');
  }
  const item = await response.json();
  return mapCollaboratorPayment(item);
}

export async function cancelCollaboratorPayment(
  collaboratorPaymentId: string,
  token?: string | null
): Promise<CollaboratorPayment> {
  const response = await client.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].cancel.$post(
    { param: { collaboratorPaymentId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel collaborator payment');
  }
  const item = await response.json();
  return mapCollaboratorPayment(item);
}
