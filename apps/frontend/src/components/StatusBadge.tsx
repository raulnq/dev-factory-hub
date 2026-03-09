import { Badge, type BadgeProps } from './ui/badge';

type StatusBadgeProps = {
  status: string;
  variant: BadgeProps['variant'];
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  return <Badge variant={variant}>{status}</Badge>;
}
