'use client';

import * as React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useProject } from '@/components/layout/project-context';
import { InsightSummaryCard } from '@/components/insights/insight-summary-card';
import { ThemesAndComplaints } from '@/components/insights/themes-and-complaints';
import { RecommendationsView } from '@/components/insights/recommendations-view';
import { SuggestedReplies } from '@/components/insights/suggested-replies';

export default function AIInsightsPage() {
  const { currentProject, insightsReport, isDemoMode } = useProject();

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Sparkles className="w-7 h-7 text-indigo-400" />
              AI Intelligence & Strategic Insights
            </h1>
            {isDemoMode && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                Sample Data
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated LLM synthesis powered by Google Gemini, extracting actionable brand takeaways for{' '}
            <strong className="text-slate-200">{currentProject?.name}</strong>.
          </p>
        </div>
      </div>

      {/* Main Executive Summary & Emerging Topics */}
      <InsightSummaryCard report={insightsReport} />

      {/* Positive Praise vs Recurring Complaints */}
      <ThemesAndComplaints report={insightsReport} />

      {/* Actionable Recommendations */}
      <RecommendationsView report={insightsReport} />

      {/* Suggested Social Media Responses */}
      <SuggestedReplies report={insightsReport} />
    </DashboardShell>
  );
}
