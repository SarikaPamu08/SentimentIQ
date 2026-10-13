'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Sparkles,
  RefreshCw,
  User,
  Plus,
  Menu,
} from 'lucide-react';
import { useProject } from './project-context';
import { Button } from '@/components/ui/button';

export function Header({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const {
    projects,
    currentProject,
    setCurrentProject,
    isDemoMode,
    loadDemoData,
    clearDemoData,
    analyzeAllPending,
    isAnalyzingBatch,
    stats,
  } = useProject();

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#090d16]/90 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800/80 text-sm font-medium text-white transition-colors"
          >
            <FolderKanban className="w-4 h-4 text-indigo-400" />
            <span className="max-w-[140px] sm:max-w-[200px] truncate">
              {currentProject ? currentProject.name : 'Select Project'}
            </span>
            <svg
              className="w-3.5 h-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Your Projects ({projects.length})
                </div>
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        setCurrentProject(proj);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                        currentProject?.id === proj.id
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{proj.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">
                        {proj.brand_or_topic}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="pt-2 mt-1 border-t border-slate-800">
                  <Link
                    href="/projects"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Manage all projects
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Brand Topic Pill */}
        {currentProject && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
            <span>Tracking:</span>
            <strong className="text-slate-200 font-semibold">
              {currentProject.brand_or_topic}
            </strong>
          </span>
        )}
      </div>

      {/* Action items */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Analyze Batch Button */}
        {stats.pending_posts > 0 && (
          <Button
            size="sm"
            variant="primary"
            onClick={analyzeAllPending}
            isLoading={isAnalyzingBatch}
            className="hidden sm:inline-flex bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analyze {stats.pending_posts} Pending
          </Button>
        )}

        {/* Demo Experience Switcher */}
        {isDemoMode ? (
          <Button
            size="sm"
            variant="outline"
            onClick={clearDemoData}
            title="Reset demo data to start fresh"
            className="text-xs text-amber-400 border-amber-800/60 hover:bg-amber-950/40"
          >
            Clear Demo Data
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={loadDemoData}
            title="Load sample dataset for interactive exploration"
            className="text-xs text-indigo-400 border-indigo-800/60 hover:bg-indigo-950/40"
          >
            <RefreshCw className="w-3 h-3" />
            Load Sample Data
          </Button>
        )}

        {/* User Account / Profile */}
        <Link
          href="/settings"
          className="flex items-center gap-2 pl-2 border-l border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </header>
  );
}
