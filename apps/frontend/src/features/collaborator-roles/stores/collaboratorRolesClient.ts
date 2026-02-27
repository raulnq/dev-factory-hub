import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddCollaboratorRole,
  EditCollaboratorRole,
  CollaboratorRole,
  ListCollaboratorRoles,
} from '#/features/collaborator-roles/schemas';

export async function listCollaboratorRoles(
  params?: ListCollaboratorRoles,
  token?: string | null
): Promise<Page<CollaboratorRole>> {
  const response = await client.api['collaborator-roles'].$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        name: params?.name,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch collaborator roles');
  }
  return response.json() as Promise<Page<CollaboratorRole>>;
}

export async function getCollaboratorRole(
  collaboratorRoleId: string,
  token?: string | null
): Promise<CollaboratorRole> {
  const response = await client.api['collaborator-roles'][
    ':collaboratorRoleId'
  ].$get(
    { param: { collaboratorRoleId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch collaborator role');
  }
  return response.json() as Promise<CollaboratorRole>;
}

export async function addCollaboratorRole(
  data: AddCollaboratorRole,
  token?: string | null
): Promise<CollaboratorRole> {
  const response = await client.api['collaborator-roles'].$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add collaborator role');
  }
  return response.json() as Promise<CollaboratorRole>;
}

export async function editCollaboratorRole(
  collaboratorRoleId: string,
  data: EditCollaboratorRole,
  token?: string | null
): Promise<CollaboratorRole> {
  const response = await client.api['collaborator-roles'][
    ':collaboratorRoleId'
  ].$put(
    {
      param: { collaboratorRoleId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update collaborator role');
  }
  return response.json() as Promise<CollaboratorRole>;
}
