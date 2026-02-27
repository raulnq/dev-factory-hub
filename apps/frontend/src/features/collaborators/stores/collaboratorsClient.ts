import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddCollaborator,
  EditCollaborator,
  Collaborator,
  ListCollaborators,
} from '#/features/collaborators/schemas';

export async function listCollaborators(
  params?: ListCollaborators,
  token?: string | null
): Promise<Page<Collaborator>> {
  const response = await client.api.collaborators.$get(
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
    throw new Error(error.detail || 'Failed to fetch collaborators');
  }
  return response.json() as Promise<Page<Collaborator>>;
}

export async function getCollaborator(
  collaboratorId: string,
  token?: string | null
): Promise<Collaborator> {
  const response = await client.api.collaborators[':collaboratorId'].$get(
    { param: { collaboratorId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch collaborator');
  }
  return response.json() as Promise<Collaborator>;
}

export async function addCollaborator(
  data: AddCollaborator,
  token?: string | null
): Promise<Collaborator> {
  const response = await client.api.collaborators.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add collaborator');
  }
  return response.json() as Promise<Collaborator>;
}

export async function editCollaborator(
  collaboratorId: string,
  data: EditCollaborator,
  token?: string | null
): Promise<Collaborator> {
  const response = await client.api.collaborators[':collaboratorId'].$put(
    {
      param: { collaboratorId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update collaborator');
  }
  return response.json() as Promise<Collaborator>;
}
