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
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  FileText,
  Wallet,
  CircleDollarSign,
  Receipt,
  ArrowLeftRight,
  RefreshCw,
  BadgeDollarSign,
  Landmark,
  PiggyBank,
  Scale,
  BarChart2,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { UserButton } from '@clerk/clerk-react';

type NavItem = {
  title: string;
  to: string;
  icon: React.ElementType;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', to: '/', icon: LayoutDashboard },
  { title: 'Clients', to: '/clients', icon: Users },
  { title: 'Collaborators', to: '/collaborators', icon: Briefcase },
  { title: 'Collaborator Roles', to: '/collaborator-roles', icon: Users },
  { title: 'Timesheets', to: '/timesheets', icon: Clock },
  { title: 'Proformas', to: '/proformas', icon: FileText },
  { title: 'Payments', to: '/collaborator-payments', icon: Wallet },
  { title: 'Collections', to: '/collections', icon: CircleDollarSign },
  { title: 'Invoices', to: '/invoices', icon: Receipt },
  { title: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
  { title: 'Money Exchanges', to: '/money-exchanges', icon: RefreshCw },
  { title: 'Payroll Payments', to: '/payroll-payments', icon: BadgeDollarSign },
  { title: 'Tax Payments', to: '/tax-payments', icon: Landmark },
  { title: 'Bank Balance', to: '/bank-balance', icon: PiggyBank },
  { title: 'Collaborator Balance', to: '/collaborator-balance', icon: Scale },
  { title: 'Client Balance', to: '/client-balance', icon: BarChart2 },
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
