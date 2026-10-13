'use client';

import * as React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SentimentStats } from '@/types/sentiment';

const COLORS = {
  Positive: '#10b981', // emerald-500
  Neutral: '#64748b',  // slate-500
  Negative: '#f43f5e', // rose-500
};

export function SentimentPieChart({ stats }: { stats: SentimentStats }) {
  const data = [
    { name: 'Positive', value: stats.positive_count, color: COLORS.Positive },
    { name: 'Neutral', value: stats.neutral_count, color: COLORS.Neutral },
    { name: 'Negative', value: stats.negative_count, color: COLORS.Negative },
  ].filter((d) => d.value > 0);

  const hasData = stats.analyzed_posts > 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Sentiment Distribution</CardTitle>
        <CardDescription>
          Ratio of Positive, Neutral, and Negative mentions
        </CardDescription>
      </CardHeader>
      <div className="flex-1 flex items-center justify-center min-h-[260px]">
        {hasData ? (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0];
                      const pct = Math.round(
                        ((item.value as number) / stats.analyzed_posts) * 100
                      );
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-slate-300">
                            Count: <span className="font-mono">{item.value}</span> ({pct}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value, entry: any) => (
                    <span className="text-xs text-slate-300 font-medium ml-1">
                      {value} ({entry.payload.value})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-300">No Sentiment Data Yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Add posts and click &ldquo;Analyze&rdquo; to populate the sentiment breakdown.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
