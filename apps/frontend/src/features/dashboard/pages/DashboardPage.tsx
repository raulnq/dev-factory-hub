import {
  CollaboratorBalanceSummaryTable,
  CollaboratorBalanceSummarySkeleton,
} from '@/features/collaborator-balance/components/CollaboratorBalanceSummaryTable';
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
    </div>
  );
}
