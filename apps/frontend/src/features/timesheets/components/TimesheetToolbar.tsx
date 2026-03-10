import { CompleteAction } from './CompleteAction';
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
      <CompleteAction
        disabled={!canComplete}
        isPending={isPending}
        onComplete={onComplete}
      />
    </>
  );
}
