import { Badge } from './ui/badge';

interface TemplateBadgeProps {
  variant: 'creator-favorite' | 'trending' | 'most-used';
}

const badgeConfig = {
  'creator-favorite': {
    label: 'Creator favorite',
    className: 'bg-chart-1/10 text-chart-1 border-chart-1/20 hover:bg-chart-1/20',
  },
  'trending': {
    label: 'Trending this week',
    className: 'bg-chart-2/10 text-chart-2 border-chart-2/20 hover:bg-chart-2/20',
  },
  'most-used': {
    label: 'Most used',
    className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
  },
};

export default function TemplateBadge({ variant }: TemplateBadgeProps) {
  const config = badgeConfig[variant];
  
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}
