import { TimesheetCompleteAction } from './TimesheetCompleteAction';
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
      <TimesheetCompleteAction
        disabled={!canComplete}
        isPending={isPending}
        onComplete={onComplete}
      />
    </>
  );
}
