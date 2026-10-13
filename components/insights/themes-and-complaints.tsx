'use client';

import * as React from 'react';
import { ThumbsUp, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIInsightReport } from '@/types/sentiment';

export function ThemesAndComplaints({ report }: { report: AIInsightReport | null }) {
  if (!report) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Positive Themes */}
      <Card className="border-emerald-950/60 bg-emerald-950/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-emerald-100">Major Positive Themes & Praise</CardTitle>
              <CardDescription>Features and qualities customers love most</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-3.5">
          {report.positive_themes.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-emerald-900/40 bg-slate-950/50 hover:border-emerald-700/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-sm font-semibold text-emerald-300">
                  {item.theme}
                </h4>
                <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  {item.frequency}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Negative Themes & Common Complaints */}
      <Card className="border-rose-950/60 bg-rose-950/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-800/60">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-rose-100">Recurring Complaints & Vulnerabilities</CardTitle>
              <CardDescription>Pain points negatively impacting customer sentiment</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-3.5">
          {report.negative_themes.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-rose-900/40 bg-slate-950/50 hover:border-rose-700/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-sm font-semibold text-rose-300">
                  {item.complaint}
                </h4>
                <Badge
                  variant={
                    item.impact === 'High'
                      ? 'negative'
                      : item.impact === 'Medium'
                      ? 'amber'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {item.impact} Impact
                </Badge>
              </div>
              <div className="mt-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-start gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Mitigation: </strong>
                  {item.suggested_action}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
