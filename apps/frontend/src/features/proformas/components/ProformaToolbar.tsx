import { ProformaIssueAction } from './ProformaIssueAction';
import type { IssueProforma } from '#/features/proformas/schemas';
import { ProformaCancelAction } from './ProformaCancelAction';

type ProformaToolbarProps = {
  status: string;
  isPending: boolean;
  total: number;
  onCancel: () => void;
  onIssue: (data: IssueProforma) => void;
};

export function ProformaToolbar({
  status,
  isPending,
  onIssue,
  onCancel,
  total,
}: ProformaToolbarProps) {
  const canIssue = status === 'Pending';
  const canCancel = status !== 'Canceled';
  return (
    <>
      <ProformaIssueAction
        onIssue={onIssue}
        isPending={isPending}
        disabled={total <= 0 || !canIssue}
      />
      <ProformaCancelAction
        disabled={!canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />
    </>
  );
}
