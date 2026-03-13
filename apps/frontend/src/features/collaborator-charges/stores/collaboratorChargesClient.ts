import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  AddCollaboratorCharge,
  CollaboratorCharge,
  EditCollaboratorCharge,
  ListCollaboratorCharges,
  PayCollaboratorCharge,
} from '#/features/collaborator-charges/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCollaboratorCharge(item: any): CollaboratorCharge {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
  };
}

export async function listCollaboratorCharges(
  params?: ListCollaboratorCharges,
  token?: string | null
): Promise<Page<CollaboratorCharge>> {
  const response = await client.api['collaborator-charges'].$get(
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
    throw new Error(error.detail || 'Failed to fetch collaborator charges');
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(mapCollaboratorCharge),
  };
}

export async function getCollaboratorCharge(
  collaboratorChargeId: string,
  token?: string | null
): Promise<CollaboratorCharge> {
  const response = await client.api['collaborator-charges'][
    ':collaboratorChargeId'
  ].$get(
    { param: { collaboratorChargeId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch collaborator charge');
  }
  const item = await response.json();
  return mapCollaboratorCharge(item);
}

export async function addCollaboratorCharge(
  data: AddCollaboratorCharge,
  token?: string | null
): Promise<CollaboratorCharge> {
  const response = await client.api['collaborator-charges'].$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add collaborator charge');
  }
  const item = await response.json();
  return mapCollaboratorCharge(item);
}

export async function editCollaboratorCharge(
  collaboratorChargeId: string,
  data: EditCollaboratorCharge,
  token?: string | null
): Promise<CollaboratorCharge> {
  const response = await client.api['collaborator-charges'][
    ':collaboratorChargeId'
  ].$patch(
    {
      param: { collaboratorChargeId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update collaborator charge');
  }
  const item = await response.json();
  return mapCollaboratorCharge(item);
}

export async function payCollaboratorCharge(
  collaboratorChargeId: string,
  data: PayCollaboratorCharge,
  token?: string | null
): Promise<CollaboratorCharge> {
  const response = await client.api['collaborator-charges'][
    ':collaboratorChargeId'
  ].pay.$post(
    { param: { collaboratorChargeId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to pay collaborator charge');
  }
  const item = await response.json();
  return mapCollaboratorCharge(item);
}

export async function cancelCollaboratorCharge(
  collaboratorChargeId: string,
  token?: string | null
): Promise<CollaboratorCharge> {
  const response = await client.api['collaborator-charges'][
    ':collaboratorChargeId'
  ].cancel.$post(
    { param: { collaboratorChargeId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel collaborator charge');
  }
  const item = await response.json();
  return mapCollaboratorCharge(item);
}
