import { CompleteButton } from './CompleteButton';
import type { CompleteTimesheet } from '#/features/timesheets/schemas';

type TimesheetToolbarProps = {
  status: string;
  isPending: boolean;
  onComplete: (data: CompleteTimesheet) => void;
};

export function TimesheetToolbar({
  status,
  isPending,
  onComplete,
}: TimesheetToolbarProps) {
  const canComplete = status === 'Pending';

  return (
    <>
      <CompleteButton
        disabled={isPending || !canComplete}
        onComplete={onComplete}
      />
    </>
  );
}
