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
  X,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Posts & Feed', href: '/posts', icon: MessageSquareText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'AI Insights', href: '/insights', icon: Sparkles },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-[#090d16] border-r border-slate-800 p-5 flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="font-bold text-white text-base">SentimentIQ</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 py-6">
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
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
          Powered by Google Gemini 2.5 & Supabase
        </div>
      </div>
    </div>
  );
}
