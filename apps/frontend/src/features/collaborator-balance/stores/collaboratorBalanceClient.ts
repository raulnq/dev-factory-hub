import { client } from '@/client';
import type {
  CollaboratorBalance,
  ListCollaboratorBalance,
} from '#/features/collaborator-balance/schemas';

export async function getCollaboratorBalance(
  params: ListCollaboratorBalance,
  token?: string | null
): Promise<CollaboratorBalance> {
  const response = await client.api['collaborator-balance'].$get(
    {
      query: {
        currency: params.currency,
        collaboratorId: params.collaboratorId,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail ||
        'Failed to fetch collaborator balance'
    );
  }
  return response.json();
}
