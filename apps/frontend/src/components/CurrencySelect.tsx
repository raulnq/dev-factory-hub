import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CURRENCIES = ['USD', 'PEN'];

type CurrencySelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  allowEmpty?: boolean;
  placeholder?: string;
};

export function CurrencySelect({
  value,
  onValueChange,
  disabled,
  id,
  allowEmpty,
  placeholder = 'Select currency',
}: CurrencySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowEmpty && <SelectItem value="all">All</SelectItem>}
        {CURRENCIES.map(c => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
