import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  colorScheme?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'indigo',
}: StatCardProps) {
  const schemeClasses = {
    indigo: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/50',
    emerald: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
    rose: 'text-rose-400 bg-rose-950/40 border-rose-800/50',
    amber: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
    slate: 'text-slate-400 bg-slate-900 border-slate-800',
  }[colorScheme];

  return (
    <Card className="hover:border-slate-700/80 transition-all p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium inline-flex items-center',
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl border',
            schemeClasses
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
