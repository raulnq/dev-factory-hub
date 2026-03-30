import { useBankBalanceSummarySuspense } from '../stores/useBankBalance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router';

function formatNumber(value: number): string {
  return new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function BankBalanceKpiCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function BankBalanceKpiCards() {
  const { data: summary } = useBankBalanceSummarySuspense({
    pageSize: 20,
    pageNumber: 1,
  });

  const rows = summary.items;

  if (rows.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map(row => (
        <Link
          key={row.currency}
          to={`/bank-balance?currency=${row.currency}`}
          className="focus-visible:ring-ring rounded-xl focus-visible:outline-none focus-visible:ring-2"
        >
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {row.currency}
              </CardTitle>
              <Landmark className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(row.balance)}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
