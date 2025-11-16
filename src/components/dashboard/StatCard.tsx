//src/components/dashboard/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'error';
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
}: StatCardProps) => {
  const variantStyles = {
    default: 'border-primary/20',
    success: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    error: 'border-destructive/20 bg-destructive/5',
  };

  return (
    <Card className={cn('transition-all hover:shadow-lg', variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <p
            className={cn(
              'text-xs mt-1',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% desde o último mês
          </p>
        )}
      </CardContent>
    </Card>
  );
};
