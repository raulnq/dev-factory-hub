import type { BadgeProps } from '@/components/ui/badge';

const STATUS_VARIANTS: Record<string, BadgeProps['variant']> = {
  Pending: 'default',
  Issued: 'secondary',
  Canceled: 'destructive',
};

export function getStatusVariant(status: string): BadgeProps['variant'] {
  return STATUS_VARIANTS[status] || 'secondary';
}
