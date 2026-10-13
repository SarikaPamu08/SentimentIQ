'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SocialPost } from '@/types/sentiment';

export function SentimentTrendChart({ posts }: { posts: SocialPost[] }) {
  const chartData = React.useMemo(() => {
    const analyzed = posts.filter((p) => p.status === 'completed' && p.analysis);
    if (analyzed.length === 0) return [];

    // Group by day
    const dayMap = new Map<string, { totalScore: number; count: number; dateStr: string }>();

    analyzed.forEach((p) => {
      const d = new Date(p.published_at);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      const existing = dayMap.get(key) || { totalScore: 0, count: 0, dateStr: key };
      existing.totalScore += p.analysis?.sentiment_score || 0;
      existing.count += 1;
      dayMap.set(key, existing);
    });

    return Array.from(dayMap.values()).map((item) => ({
      date: item.dateStr,
      avgScore: Number((item.totalScore / item.count).toFixed(2)),
      volume: item.count,
    }));
  }, [posts]);

  const hasData = chartData.length > 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Sentiment Trend Over Time</CardTitle>
        <CardDescription>
          Daily average sentiment score (-1.0 to +1.0) and volume trajectory
        </CardDescription>
      </CardHeader>
      <div className="flex-1 flex items-center justify-center min-h-[260px] pt-2">
        {hasData ? (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  domain={[-1, 1]}
                  ticks={[-1, -0.5, 0, 0.5, 1]}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      const scoreColor =
                        item.avgScore > 0.2
                          ? 'text-emerald-400'
                          : item.avgScore < -0.2
                          ? 'text-rose-400'
                          : 'text-slate-300';
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl space-y-1">
                          <p className="font-semibold text-white">{item.date}</p>
                          <p className="text-slate-300">
                            Avg Score:{' '}
                            <span className={`font-mono font-bold ${scoreColor}`}>
                              {item.avgScore > 0 ? `+${item.avgScore}` : item.avgScore}
                            </span>
                          </p>
                          <p className="text-slate-400">
                            Posts analyzed: <span className="font-mono text-white">{item.volume}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-medium text-slate-300">No Timeline Data Available</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Analyzed posts will graph chronological brand perception here.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
