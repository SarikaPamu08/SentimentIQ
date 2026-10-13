'use client';

import * as React from 'react';
import { BarChart3, TrendingUp, Download, Printer } from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useProject } from '@/components/layout/project-context';
import { SentimentPieChart } from '@/components/dashboard/sentiment-pie-chart';
import { SentimentTrendChart } from '@/components/dashboard/sentiment-trend-chart';
import { PlatformChart } from '@/components/dashboard/platform-chart';
import { EmotionDistribution } from '@/components/analytics/emotion-distribution';
import { KeywordsCloud } from '@/components/analytics/keywords-cloud';
import { ExportMenu } from '@/components/analytics/export-menu';
import { StatCard } from '@/components/dashboard/stat-card';
import { MessageSquare, Smile, Frown, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { currentProject, posts, stats, insightsReport, isDemoMode } = useProject();

  return (
    <DashboardShell>
      {/* Page Header with Export Menu */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-indigo-400" />
              Analytics & Executive Reports
            </h1>
            {isDemoMode && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                Sample Data
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Statistical breakdown, emotion profiling, and downloadable reports for{' '}
            <strong className="text-slate-200">{currentProject?.name}</strong>.
          </p>
        </div>

        {/* Export & Print Controls */}
        <ExportMenu
          project={currentProject}
          posts={posts}
          stats={stats}
          report={insightsReport}
        />
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Posts Analyzed"
          value={stats.analyzed_posts}
          subtitle={`Out of ${stats.total_posts} total`}
          icon={MessageSquare}
          colorScheme="slate"
        />
        <StatCard
          title="Positive Mentions"
          value={`${stats.positive_pct}%`}
          subtitle={`${stats.positive_count} posts`}
          icon={Smile}
          colorScheme="emerald"
        />
        <StatCard
          title="Negative Mentions"
          value={`${stats.negative_pct}%`}
          subtitle={`${stats.negative_count} posts`}
          icon={Frown}
          colorScheme="rose"
        />
        <StatCard
          title="Avg Sentiment Score"
          value={stats.avg_score > 0 ? `+${stats.avg_score}` : stats.avg_score}
          subtitle={`AI Confidence: ${Math.round(stats.avg_confidence * 100)}%`}
          icon={Activity}
          colorScheme="indigo"
        />
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SentimentPieChart stats={stats} />
        </div>
        <div className="lg:col-span-2">
          <SentimentTrendChart posts={posts} />
        </div>
      </div>

      {/* Secondary Analytics Charts Row: Platforms & Emotions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformChart posts={posts} />
        <EmotionDistribution posts={posts} />
      </div>

      {/* Topic Keywords & Cloud */}
      <div className="grid grid-cols-1 gap-6">
        <KeywordsCloud posts={posts} />
      </div>
    </DashboardShell>
  );
}
