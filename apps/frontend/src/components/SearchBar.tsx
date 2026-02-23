import { Button } from './ui/button';

type SearchBarProps = {
  onSearch: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  showClearButton?: boolean;
  onClear?: () => void;
};

export function SearchBar({
  onSearch,
  children,
  showClearButton,
  onClear,
}: SearchBarProps) {
  return (
    <form onSubmit={onSearch} className="flex items-center gap-2">
      {children}
      <Button type="submit" variant="secondary">
        Search
      </Button>
      {showClearButton && (
        <Button type="button" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      )}
    </form>
  );
}
