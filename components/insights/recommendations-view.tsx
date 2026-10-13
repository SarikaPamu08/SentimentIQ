'use client';

import * as React from 'react';
import { Target, Zap, ShieldAlert, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIInsightReport } from '@/types/sentiment';

export function RecommendationsView({ report }: { report: AIInsightReport | null }) {
  if (!report || !report.recommendations || report.recommendations.length === 0) return null;

  const categoryIcons = {
    Immediate: Zap,
    Strategic: Target,
    Communication: MessageSquare,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Actionable AI Recommendations</CardTitle>
            <CardDescription>
              Prioritized operational and marketing interventions based on sentiment evidence
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {report.recommendations.map((rec, idx) => {
          const Icon = categoryIcons[rec.category] || Target;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-indigo-400" />
                    {rec.category} Action
                  </span>
                  <Badge
                    variant={
                      rec.category === 'Immediate'
                        ? 'negative'
                        : rec.category === 'Strategic'
                        ? 'purple'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    Priority
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold text-white leading-snug">
                  {rec.action}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Rationale: </strong>
                  {rec.rationale}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
