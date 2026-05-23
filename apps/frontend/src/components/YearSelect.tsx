import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const START_YEAR = 2020;
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - START_YEAR + 1 }, (_, i) =>
  String(START_YEAR + i)
);

type YearSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
};

export function YearSelect({
  value,
  onValueChange,
  disabled,
  id,
  placeholder = 'Select year...',
}: YearSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {YEARS.map(y => (
          <SelectItem key={y} value={y}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
