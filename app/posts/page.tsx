'use client';

import * as React from 'react';
import { Plus, Upload, Sparkles, MessageSquareText } from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useProject } from '@/components/layout/project-context';
import { PostsTable } from '@/components/posts/posts-table';
import { AddPostModal } from '@/components/posts/add-post-modal';
import { CsvImportModal } from '@/components/posts/csv-import-modal';
import { PostDetailModal } from '@/components/posts/post-detail-modal';
import { Button } from '@/components/ui/button';
import { SocialPost } from '@/types/sentiment';

export default function PostsManagementPage() {
  const { currentProject, posts, stats, isDemoMode } = useProject();

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<SocialPost | null>(null);

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <MessageSquareText className="w-7 h-7 text-indigo-400" />
              Posts & Mentions Feed
            </h1>
            {isDemoMode && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                Sample Data
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, filter, and inspect collected social media posts for{' '}
            <strong className="text-slate-200">
              {currentProject?.name || 'All Projects'}
            </strong>
            .
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Total: <strong className="text-white font-mono">{stats.total_posts}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400">
            Analyzed: <strong className="font-mono">{stats.analyzed_posts}</strong>
          </span>
          {stats.pending_posts > 0 && (
            <span className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-400">
              Pending: <strong className="font-mono">{stats.pending_posts}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Table with Filters & Modals */}
      <PostsTable
        posts={posts}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onViewPost={(post) => setSelectedPost(post)}
      />

      {/* Modals */}
      <AddPostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
      />

      <PostDetailModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </DashboardShell>
  );
}
