'use client';

import * as React from 'react';
import { Tag, Hash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SocialPost } from '@/types/sentiment';

export function KeywordsCloud({ posts }: { posts: SocialPost[] }) {
  const keywordStats = React.useMemo(() => {
    const counts = new Map<string, { count: number; sentimentScoreSum: number }>();

    posts.forEach((p) => {
      if (p.analysis?.keywords) {
        p.analysis.keywords.forEach((kw) => {
          const norm = kw.toLowerCase().trim();
          const existing = counts.get(norm) || { count: 0, sentimentScoreSum: 0 };
          existing.count += 1;
          existing.sentimentScoreSum += p.analysis?.sentiment_score || 0;
          counts.set(norm, existing);
        });
      }
    });

    return Array.from(counts.entries())
      .map(([keyword, stat]) => ({
        keyword,
        count: stat.count,
        avgScore: stat.sentimentScoreSum / stat.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 16);
  }, [posts]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Frequent Topics & Keywords</CardTitle>
        <CardDescription>
          Keywords extracted by Gemini, colored by net sentiment score
        </CardDescription>
      </CardHeader>

      <div className="flex-1 p-2">
        {keywordStats.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {keywordStats.map((item, idx) => {
              const isPos = item.avgScore > 0.2;
              const isNeg = item.avgScore < -0.2;
              return (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-transform hover:scale-105 ${
                    isPos
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                      : isNeg
                      ? 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <Hash className="w-3 h-3 opacity-60" />
                  <span>{item.keyword}</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-black/40">
                    {item.count}
                  </span>
                </span>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm font-medium text-slate-300">No Keywords Extracted Yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Run AI analysis on posts to discover recurring discussion keywords.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
