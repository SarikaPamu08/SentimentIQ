'use client';

import * as React from 'react';
import { Sparkles, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIInsightReport } from '@/types/sentiment';
import { formatDate } from '@/lib/utils';
import { useProject } from '@/components/layout/project-context';

export function InsightSummaryCard({ report }: { report: AIInsightReport | null }) {
  const { generateInsights, isGeneratingInsights, currentProject } = useProject();

  if (!report) {
    return (
      <Card className="text-center py-12 border-dashed">
        <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No AI Intelligence Report Generated</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Aggregate collected social mentions to synthesize positive themes, recurring complaints, and actionable brand recommendations.
        </p>
        <Button
          size="md"
          variant="primary"
          onClick={generateInsights}
          isLoading={isGeneratingInsights}
          className="mt-5 bg-gradient-to-r from-indigo-600 to-indigo-500"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Generate Intelligence Report
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-indigo-900/50 bg-gradient-to-br from-slate-900/90 to-indigo-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <CardTitle>{report.title}</CardTitle>
          </div>
          <CardDescription className="mt-1 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Generated {formatDate(report.created_at)}
            </span>
            <span>•</span>
            <span className="text-indigo-300 font-medium">
              Based on {report.post_count_analyzed} analyzed mentions
            </span>
          </CardDescription>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={generateInsights}
          isLoading={isGeneratingInsights}
          className="text-xs border-indigo-700/60 hover:bg-indigo-950/40 text-indigo-300"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Refresh Insights
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Executive Synthesis
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {report.summary}
          </p>
        </div>

        {/* Emerging Topics Pills */}
        {report.emerging_topics && report.emerging_topics.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Emerging Discussion Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {report.emerging_topics.map((topic, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
