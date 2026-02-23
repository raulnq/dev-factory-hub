import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router';
import { ThemeToggle } from '../ThemeToggle';

const TITLE_BY_PATH: Record<string, string> = {
  '/': 'Dashboard',
  '/applications': 'Applications',
  '/clients': 'Clients',
  '/leads': 'Leads',
  '/properties': 'Properties',
};

function usePageTitle() {
  const { pathname } = useLocation();

  const matchedKey = Object.keys(TITLE_BY_PATH)
    .sort((a, b) => b.length - a.length)
    .find(key => pathname.startsWith(key));

  return matchedKey ? TITLE_BY_PATH[matchedKey] : 'CRM';
}

export function AppHeader() {
  const title = usePageTitle();

  return (
    <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b bg-background px-3 md:h-14 md:px-6">
      <SidebarTrigger />

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold md:text-base">{title}</h1>
      </div>

      <div className="hidden max-w-md flex-1 items-center gap-2 md:flex">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search…"
            aria-label="Global search"
          />
        </div>
      </div>
      <ThemeToggle />
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell />
      </Button>
    </header>
  );
}
