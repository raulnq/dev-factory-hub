import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router';

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-svh w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="flex-1 p-4 md:p-6 min-w-0">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
