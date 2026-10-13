import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0f17] disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-950',
      secondary:
        'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-800 focus:ring-slate-500 border border-slate-700',
      outline:
        'border border-slate-700 text-slate-300 hover:bg-slate-800/80 hover:text-white focus:ring-slate-500',
      ghost:
        'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 focus:ring-slate-500',
      danger:
        'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 focus:ring-rose-500',
      success:
        'bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 focus:ring-emerald-500',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-3.5 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
