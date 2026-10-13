'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SocialPost, SocialPlatform } from '@/types/sentiment';

export function PlatformChart({ posts }: { posts: SocialPost[] }) {
  const chartData = React.useMemo(() => {
    const platforms: SocialPlatform[] = ['X', 'Reddit', 'Instagram', 'YouTube', 'LinkedIn', 'Facebook', 'Other'];
    const map = new Map<SocialPlatform, { positive: number; neutral: number; negative: number; total: number }>();

    platforms.forEach((p) => map.set(p, { positive: 0, neutral: 0, negative: 0, total: 0 }));

    posts.forEach((p) => {
      const entry = map.get(p.platform) || { positive: 0, neutral: 0, negative: 0, total: 0 };
      entry.total += 1;
      if (p.analysis) {
        if (p.analysis.sentiment === 'Positive') entry.positive += 1;
        else if (p.analysis.sentiment === 'Neutral') entry.neutral += 1;
        else if (p.analysis.sentiment === 'Negative') entry.negative += 1;
      }
      map.set(p.platform, entry);
    });

    return platforms
      .map((platform) => {
        const d = map.get(platform)!;
        return {
          platform,
          Positive: d.positive,
          Neutral: d.neutral,
          Negative: d.negative,
          total: d.total,
        };
      })
      .filter((d) => d.total > 0);
  }, [posts]);

  const hasData = chartData.length > 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Platform Comparison</CardTitle>
        <CardDescription>
          Distribution of positive, neutral, and negative posts across networks
        </CardDescription>
      </CardHeader>
      <div className="flex-1 flex items-center justify-center min-h-[260px] pt-2">
        {hasData ? (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="platform" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl space-y-1">
                          <p className="font-semibold text-white">{label}</p>
                          {payload.map((entry: any) => (
                            <div key={entry.name} className="flex justify-between gap-4">
                              <span className="text-slate-400">{entry.name}:</span>
                              <span className="font-mono font-medium text-white">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => (
                    <span className="text-xs text-slate-300 font-medium ml-1">{value}</span>
                  )}
                />
                <Bar dataKey="Positive" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Neutral" stackId="a" fill="#64748b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Negative" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-medium text-slate-300">No Platform Data</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Compare channel metrics by ingesting posts from X, Reddit, Instagram, etc.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
