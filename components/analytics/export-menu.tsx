'use client';

import * as React from 'react';
import Papa from 'papaparse';
import { Download, FileJson, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SocialPost, Project, SentimentStats, AIInsightReport } from '@/types/sentiment';

export function ExportMenu({
  project,
  posts,
  stats,
  report,
}: {
  project: Project | null;
  posts: SocialPost[];
  stats: SentimentStats;
  report: AIInsightReport | null;
}) {
  const exportCSV = () => {
    const csvData = posts.map((p) => ({
      id: p.id,
      platform: p.platform,
      author: p.author || '',
      content: p.content,
      published_at: p.published_at,
      status: p.status,
      sentiment: p.analysis?.sentiment || 'Pending',
      sentiment_score: p.analysis?.sentiment_score ?? '',
      confidence: p.analysis?.confidence ?? '',
      emotions: p.analysis?.emotions.join(', ') || '',
      keywords: p.analysis?.keywords.join(', ') || '',
      explanation: p.analysis?.explanation || '',
      language: p.analysis?.language || '',
      sarcasm_detected: p.analysis?.sarcasm_detected ? 'true' : 'false',
    }));

    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${project?.name.toLowerCase().replace(/\s+/g, '_') || 'sentiment'}_analysis.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const payload = {
      project,
      summary_stats: stats,
      ai_insights: report,
      posts_analyzed: posts,
      exported_at: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${project?.name.toLowerCase().replace(/\s+/g, '_') || 'sentiment'}_report.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportCSV}
        className="text-xs border-slate-700 hover:bg-slate-800"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
        Export CSV
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportJSON}
        className="text-xs border-slate-700 hover:bg-slate-800"
      >
        <FileJson className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
        Export JSON
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={triggerPrint}
        className="text-xs bg-indigo-600 hover:bg-indigo-500"
      >
        <Printer className="w-3.5 h-3.5 mr-1.5" />
        Print Report
      </Button>
    </div>
  );
}
