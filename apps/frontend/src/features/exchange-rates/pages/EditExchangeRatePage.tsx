import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditExchangeRate } from '#/features/exchange-rates/schemas';
import {
  useEditExchangeRate,
  useExchangeRateSuspense,
} from '../stores/useExchangeRates';
import { EditExchangeRateForm } from '../components/EditExchangeRateForm';
import { ExchangeRateSkeleton } from '../components/ExchangeRateSkeleton';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditExchangeRatePage() {
  const navigate = useNavigate();
  const { exchangeRateId } = useParams<{ exchangeRateId: string }>();
  const edit = useEditExchangeRate(exchangeRateId!);

  const onSubmit: SubmitHandler<EditExchangeRate> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Exchange rate updated successfully');
      navigate('/exchange-rates');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save exchange rate'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Edit Exchange Rate"
          description="Edit an existing exchange rate."
        />
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorFallback
                  resetErrorBoundary={resetErrorBoundary}
                  message="Failed to load exchange rate"
                />
              )}
            >
              <Suspense fallback={<ExchangeRateSkeleton />}>
                <InnerExchangeRate
                  isPending={edit.isPending}
                  onSubmit={onSubmit}
                  exchangeRateId={exchangeRateId!}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <FormCardFooter
          formId="form"
          saveText="Save Exchange Rate"
          cancelText="Cancel"
          onCancel={() => navigate('/exchange-rates')}
          isPending={edit.isPending}
        />
      </Card>
    </div>
  );
}

type InnerExchangeRateProps = {
  exchangeRateId: string;
  isPending: boolean;
  onSubmit: SubmitHandler<EditExchangeRate>;
};

function InnerExchangeRate({
  isPending,
  onSubmit,
  exchangeRateId,
}: InnerExchangeRateProps) {
  const { data } = useExchangeRateSuspense(exchangeRateId);
  return (
    <EditExchangeRateForm
      isPending={isPending}
      onSubmit={onSubmit}
      exchangeRate={data}
    />
  );
}
