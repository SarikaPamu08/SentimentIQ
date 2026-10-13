'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SocialPost } from '@/types/sentiment';

const EMOTION_COLORS: Record<string, string> = {
  Joy: '#10b981',
  Excitement: '#34d399',
  Satisfaction: '#059669',
  Admiration: '#14b8a6',
  Gratitude: '#06b6d4',
  Trust: '#3b82f6',
  Relief: '#6366f1',
  Curiosity: '#8b5cf6',
  Objective: '#64748b',
  Frustration: '#f43f5e',
  Disappointment: '#e11d48',
  Annoyance: '#fb7185',
  Anger: '#be123c',
  Sarcasm: '#f59e0b',
};

export function EmotionDistribution({ posts }: { posts: SocialPost[] }) {
  const chartData = React.useMemo(() => {
    const counts = new Map<string, number>();

    posts.forEach((p) => {
      if (p.analysis?.emotions) {
        p.analysis.emotions.forEach((em) => {
          counts.set(em, (counts.get(em) || 0) + 1);
        });
      }
    });

    return Array.from(counts.entries())
      .map(([emotion, count]) => ({
        emotion,
        count,
        fill: EMOTION_COLORS[emotion] || '#818cf8',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [posts]);

  const hasData = chartData.length > 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Emotion Distribution</CardTitle>
        <CardDescription>
          Prominent psychological emotions detected in audience reactions
        </CardDescription>
      </CardHeader>

      <div className="flex-1 flex items-center justify-center min-h-[260px] pt-2">
        {hasData ? (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="emotion"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
                          <p className="font-semibold text-white">{item.emotion}</p>
                          <p className="text-slate-300">
                            Mentions: <span className="font-mono">{item.count}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-medium text-slate-300">No Emotions Identified</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              AI analysis will plot Joy, Frustration, Sarcasm, and more.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
