'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquareText,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProject } from './project-context';

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { isDemoMode } = useProject();

  const navItems = [
    {
      name: 'Overview',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: FolderKanban,
    },
    {
      name: 'Posts & Feed',
      href: '/posts',
      icon: MessageSquareText,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'AI Insights',
      href: '/insights',
      icon: Sparkles,
      highlight: true,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        'relative hidden md:flex flex-col border-r border-slate-800 bg-[#090d16] transition-all duration-300 z-20 select-none',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Logo & Name */}
      <div className="flex h-16 items-center px-4 border-b border-slate-800/80 justify-between">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-900/50">
            <TrendingUp className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Sentiment<span className="text-indigo-400">IQ</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                AI Intelligence
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Demo Mode Badge */}
      {isDemoMode && !isCollapsed && (
        <div className="mx-3 my-2.5 px-3 py-2 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Demo Experience Active</span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white',
                isCollapsed && 'justify-center px-0'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-transform group-hover:scale-105',
                  isActive
                    ? 'text-white'
                    : item.highlight
                    ? 'text-indigo-400'
                    : 'text-slate-400'
                )}
              />
              {!isCollapsed && <span>{item.name}</span>}
              {!isCollapsed && item.highlight && !isActive && (
                <span className="ml-auto text-[10px] font-semibold bg-indigo-900/60 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700/50">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80">
        {!isCollapsed ? (
          <div className="text-xs text-slate-400 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span>Model</span>
              <span className="text-slate-300 font-mono text-[11px]">Gemini 2.5 Flash</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Supabase
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Supabase Connected" />
          </div>
        )}
      </div>
    </aside>
  );
}
