import {
  CollaboratorBalanceSummaryTable,
  CollaboratorBalanceSummarySkeleton,
} from '@/features/collaborator-balance/components/CollaboratorBalanceSummaryTable';
import {
  ClientBalanceSummaryTable,
  ClientBalanceSummarySkeleton,
} from '@/features/client-balance/components/ClientBalanceSummaryTable';
import {
  BankBalanceSummaryTable,
  BankBalanceSummarySkeleton,
} from '@/features/bank-balance/components/BankBalanceSummaryTable';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';

export function DashboardPage() {
  return (
    <div className="space-y-4">
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
      <Card>
        <ListCardHeader
          title="Bank Balances"
          description="View balance summary by currency"
        />
        <CardContent>
          <Suspense fallback={<BankBalanceSummarySkeleton />}>
            <BankBalanceSummaryTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
