import { Input } from './ui/input';

type DateReadOnlyFieldProp = {
  value: string | Date | null | undefined;
};

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return value;
}

export function DateReadOnlyField({ value }: DateReadOnlyFieldProp) {
  return (
    <Input value={formatDate(value)} type={value ? 'date' : 'text'} disabled />
  );
}
