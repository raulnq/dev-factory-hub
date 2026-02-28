import { CompleteButton } from './CompleteButton';

type TimesheetToolbarProps = {
  status: string;
  isPending: boolean;
  onComplete: () => void;
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
