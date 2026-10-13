'use client';

import * as React from 'react';
import { MessageSquareShare, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIInsightReport } from '@/types/sentiment';

export function SuggestedReplies({ report }: { report: AIInsightReport | null }) {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  if (!report || !report.suggested_responses || report.suggested_responses.length === 0) {
    return null;
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
            <MessageSquareShare className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>AI-Drafted Response Templates</CardTitle>
            <CardDescription>
              Contextual response drafts for social media managers handling critical or inquisitive mentions
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-4">
        {report.suggested_responses.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-300">
                  Scenario: {item.scenario}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Recommended Tone: <strong className="text-indigo-300">{item.tone}</strong>
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(item.sample_response, idx)}
                className="text-xs border-slate-700 hover:bg-slate-800 shrink-0"
              >
                {copiedIdx === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy Reply
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 text-xs sm:text-sm text-slate-200 leading-relaxed italic">
              &ldquo;{item.sample_response}&rdquo;
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
