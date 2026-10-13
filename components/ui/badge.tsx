import * as React from 'react';
import { cn } from '@/lib/utils';
import { SentimentType, AnalysisStatus } from '@/types/sentiment';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'positive' | 'neutral' | 'negative' | 'pending' | 'processing' | 'failed' | 'purple' | 'amber';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/80',
    outline: 'border border-slate-700 text-slate-300',
    positive: 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
    negative: 'bg-rose-950/70 text-rose-400 border border-rose-800/60',
    pending: 'bg-amber-950/60 text-amber-400 border border-amber-800/60',
    processing: 'bg-blue-950/60 text-blue-400 border border-blue-800/60 animate-pulse',
    failed: 'bg-red-950/70 text-red-400 border border-red-800/60',
    purple: 'bg-indigo-950/70 text-indigo-400 border border-indigo-800/60',
    amber: 'bg-amber-950/70 text-amber-400 border border-amber-800/60',
  };

  return (
    <span
      className={cn(baseStyles, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function SentimentBadge({
  sentiment,
  score,
}: {
  sentiment: SentimentType;
  score?: number;
}) {
  const variantMap = {
    Positive: 'positive' as const,
    Neutral: 'neutral' as const,
    Negative: 'negative' as const,
  };

  return (
    <Badge variant={variantMap[sentiment]}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {sentiment}
      {score !== undefined && (
        <span className="opacity-75 font-mono text-[10px] ml-0.5">
          ({score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)})
        </span>
      )}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: AnalysisStatus }) {
  const variantMap = {
    pending: 'pending' as const,
    processing: 'processing' as const,
    completed: 'positive' as const,
    failed: 'failed' as const,
  };

  const labelMap = {
    pending: 'Pending Analysis',
    processing: 'Analyzing...',
    completed: 'Analyzed',
    failed: 'Failed',
  };

  return (
    <Badge variant={variantMap[status]}>
      {status === 'processing' && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
      )}
      {labelMap[status]}
    </Badge>
  );
}
