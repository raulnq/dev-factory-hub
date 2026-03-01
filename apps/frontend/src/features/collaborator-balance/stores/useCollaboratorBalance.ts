import { useSuspenseQuery } from '@tanstack/react-query';
import { getCollaboratorBalance } from './collaboratorBalanceClient';
import { useAuth } from '@clerk/clerk-react';
import type { ListCollaboratorBalance } from '#/features/collaborator-balance/schemas';

export function useCollaboratorBalanceSuspense(
  params: ListCollaboratorBalance
) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['collaborator-balance', params],
    queryFn: async () => {
      const token = await getToken();
      return getCollaboratorBalance(params, token);
    },
  });
}
