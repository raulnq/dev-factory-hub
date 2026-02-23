import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, ListTodo } from 'lucide-react';
import { useLocation } from 'react-router';
import { UserButton } from '@clerk/clerk-react';

type NavItem = {
  title: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { title: 'Todos', to: '/todos', icon: ListTodo },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-md px-2 py-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8',
                  userButtonPopoverCard: 'shadow-lg',
                },
              }}
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs text-sidebar-foreground/70">
                  User Profile
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map(item => {
              const active = item.end
                ? pathname === item.to
                : pathname.startsWith(item.to);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className="flex items-center gap-2"
                      activeClassName=""
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/70">
          {collapsed ? '' : 'Tip: Ctrl/Cmd + B'}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
