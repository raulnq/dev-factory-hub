import type { ComponentType } from 'react';
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
  TrendingUp,
} from 'lucide-react';

type NavItem = {
  title: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { title: 'Clients', to: '/clients', icon: Users },
  { title: 'Collaborators', to: '/collaborators', icon: Briefcase },
  { title: 'Collaborator Roles', to: '/collaborator-roles', icon: Users },
  { title: 'Timesheets', to: '/timesheets', icon: Clock },
  { title: 'Proformas', to: '/proformas', icon: FileText },
  {
    title: 'Collaborator Payments',
    to: '/collaborator-payments',
    icon: Wallet,
  },
  { title: 'Collections', to: '/collections', icon: CircleDollarSign },
  { title: 'Invoices', to: '/invoices', icon: Receipt },
  { title: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
  { title: 'Money Exchanges', to: '/money-exchanges', icon: RefreshCw },
  { title: 'Payroll Payments', to: '/payroll-payments', icon: BadgeDollarSign },
  { title: 'Tax Payments', to: '/tax-payments', icon: Landmark },
  { title: 'Bank Balance', to: '/bank-balance', icon: PiggyBank },
  { title: 'Collaborator Balance', to: '/collaborator-balance', icon: Scale },
  { title: 'Client Balance', to: '/client-balance', icon: BarChart2 },
  { title: 'Exchange Rates', to: '/exchange-rates', icon: TrendingUp },
];
