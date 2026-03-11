import type { IssueInvoice } from '#/features/invoices/schemas';
import { InvoiceIssueAction } from './InvoiceIssueAction';
import { InvoiceCancelAction } from './InvoiceCancelAction';

type InvoiceToolbarProps = {
  status: string;
  isPending: boolean;
  onIssue(data: IssueInvoice): void;
  onCancel: () => void;
  total: number;
};

export function InvoiceToolbar({
  status,
  isPending,
  onIssue,
  onCancel,
  total,
}: InvoiceToolbarProps) {
  const canIssue = status === 'Pending';
  const canCancel = status !== 'Canceled';

  return (
    <>
      <InvoiceIssueAction
        disabled={!canIssue || total <= 0}
        onIssue={onIssue}
        isPending={isPending}
      />
      <InvoiceCancelAction
        disabled={!canCancel}
        onCancel={onCancel}
        isPending={isPending}
      />
    </>
  );
}
