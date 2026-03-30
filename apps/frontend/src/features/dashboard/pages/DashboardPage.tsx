import {
  CollaboratorBalanceSummaryTable,
  CollaboratorBalanceSummarySkeleton,
} from '@/features/collaborator-balance/components/CollaboratorBalanceSummaryTable';
import {
  ClientBalanceSummaryTable,
  ClientBalanceSummarySkeleton,
} from '@/features/client-balance/components/ClientBalanceSummaryTable';
import {
  BankBalanceKpiCards,
  BankBalanceKpiCardsSkeleton,
} from '@/features/bank-balance/components/BankBalanceKpiCards';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';

export function DashboardPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<BankBalanceKpiCardsSkeleton />}>
        <BankBalanceKpiCards />
      </Suspense>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <ListCardHeader
            title="Collaborator Balances"
            description="View income and outcome entries for a collaborator by currency"
          />
          <CardContent>
            <Suspense fallback={<CollaboratorBalanceSummarySkeleton />}>
              <CollaboratorBalanceSummaryTable />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <ListCardHeader
            title="Client Balances"
            description="View income and outcome entries for a client by currency"
          />
          <CardContent>
            <Suspense fallback={<ClientBalanceSummarySkeleton />}>
              <ClientBalanceSummaryTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
