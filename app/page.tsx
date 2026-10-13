'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Smile,
  Meh,
  Frown,
  Activity,
  Clock,
  Sparkles,
  Plus,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useProject } from '@/components/layout/project-context';
import { StatCard } from '@/components/dashboard/stat-card';
import { SentimentPieChart } from '@/components/dashboard/sentiment-pie-chart';
import { SentimentTrendChart } from '@/components/dashboard/sentiment-trend-chart';
import { PlatformChart } from '@/components/dashboard/platform-chart';
import { RecentPostsTable } from '@/components/dashboard/recent-posts-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddPostModal } from '@/components/posts/add-post-modal';
import { CsvImportModal } from '@/components/posts/csv-import-modal';
import { PostDetailModal } from '@/components/posts/post-detail-modal';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { SocialPost } from '@/types/sentiment';

export default function DashboardOverviewPage() {
  const {
    currentProject,
    posts,
    stats,
    insightsReport,
    isDemoMode,
    analyzeAllPending,
    isAnalyzingBatch,
  } = useProject();

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = React.useState(false);
  const [isCreateProjModalOpen, setIsCreateProjModalOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<SocialPost | null>(null);

  return (
    <DashboardShell>
      {/* Page Header / Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sentiment Overview
            </h1>
            {isDemoMode && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                Sample Data
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time public sentiment monitoring for{' '}
            <strong className="text-slate-200">
              {currentProject?.name || 'Your Brand'}
            </strong>{' '}
            ({currentProject?.brand_or_topic || 'Social Media Mentions'}).
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {stats.pending_posts > 0 && (
            <Button
              size="sm"
              variant="primary"
              onClick={analyzeAllPending}
              isLoading={isAnalyzingBatch}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-950"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Analyze ({stats.pending_posts})
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCsvModalOpen(true)}
            className="border-slate-700 hover:bg-slate-800 text-xs"
          >
            <Upload className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Import CSV
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Post
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Mentions"
          value={stats.total_posts}
          icon={MessageSquare}
          colorScheme="slate"
          subtitle={`${stats.analyzed_posts} analyzed`}
        />
        <StatCard
          title="Positive"
          value={`${stats.positive_pct}%`}
          icon={Smile}
          colorScheme="emerald"
          subtitle={`${stats.positive_count} posts`}
        />
        <StatCard
          title="Neutral"
          value={`${stats.neutral_pct}%`}
          icon={Meh}
          colorScheme="slate"
          subtitle={`${stats.neutral_count} posts`}
        />
        <StatCard
          title="Negative"
          value={`${stats.negative_pct}%`}
          icon={Frown}
          colorScheme="rose"
          subtitle={`${stats.negative_count} posts`}
        />
        <StatCard
          title="Net Score"
          value={stats.avg_score > 0 ? `+${stats.avg_score}` : stats.avg_score}
          icon={Activity}
          colorScheme={stats.avg_score >= 0.2 ? 'emerald' : stats.avg_score <= -0.2 ? 'rose' : 'indigo'}
          subtitle="Scale -1.0 to +1.0"
        />
        <StatCard
          title="Pending Queue"
          value={stats.pending_posts}
          icon={Clock}
          colorScheme="amber"
          subtitle="Ready for AI"
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SentimentPieChart stats={stats} />
        </div>
        <div className="lg:col-span-2">
          <SentimentTrendChart posts={posts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlatformChart posts={posts} />
        </div>

        {/* AI Insight Teaser Card */}
        <div className="lg:col-span-1">
          <Card className="flex flex-col justify-between h-full bg-gradient-to-br from-slate-900/90 to-indigo-950/30 border-indigo-900/40">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-semibold text-white">AI Brand Intelligence</h3>
              </div>
              {insightsReport ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                    {insightsReport.summary}
                  </p>
                  <div className="pt-2 border-t border-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Top Recurring Praise:
                    </p>
                    <p className="text-xs text-emerald-400 font-medium">
                      ✓ {insightsReport.positive_themes[0]?.theme || 'High Build Quality'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Top Customer Complaint:
                    </p>
                    <p className="text-xs text-rose-400 font-medium">
                      ⚠ {insightsReport.negative_themes[0]?.complaint || 'Battery Drain'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Run AI synthesis to generate executive summaries, complaints breakdown, and marketing recommendations.
                </p>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800">
              <Link href="/insights">
                <Button variant="outline" size="sm" className="w-full text-xs text-indigo-300 border-indigo-700/60 hover:bg-indigo-950/40">
                  View Full Intelligence Report
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Posts Activity Table */}
      <RecentPostsTable
        posts={posts}
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

      <CreateProjectModal
        isOpen={isCreateProjModalOpen}
        onClose={() => setIsCreateProjModalOpen(false)}
      />

      <PostDetailModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </DashboardShell>
  );
}
