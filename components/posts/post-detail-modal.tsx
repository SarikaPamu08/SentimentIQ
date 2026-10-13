'use client';

import * as React from 'react';
import { Sparkles, Trash2, ExternalLink, AlertTriangle, Languages } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { SentimentBadge, Badge } from '@/components/ui/badge';
import { SocialPost } from '@/types/sentiment';
import { formatDate } from '@/lib/utils';
import { useProject } from '@/components/layout/project-context';

export function PostDetailModal({
  post,
  isOpen,
  onClose,
}: {
  post: SocialPost | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { analyzePost, deletePost } = useProject();
  const [isReanalyzing, setIsReanalyzing] = React.useState(false);

  if (!post) return null;

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    await analyzePost(post.id);
    setIsReanalyzing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Sentiment Details"
      description={`Source: ${post.platform} • ${formatDate(post.published_at)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Post Content */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
            &ldquo;{post.content}&rdquo;
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <div>
              Author: <span className="text-slate-200 font-medium">{post.author || 'Anonymous'}</span>
            </div>
            {post.post_url && (
              <a
                href={post.post_url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                View Original Post <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* AI Analysis Breakdown */}
        {post.analysis ? (
          <div className="space-y-4 rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-900/40">
              <div className="flex items-center gap-2">
                <SentimentBadge
                  sentiment={post.analysis.sentiment}
                  score={post.analysis.sentiment_score}
                />
                {post.analysis.sarcasm_detected && (
                  <Badge variant="amber" size="sm">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Sarcasm Detected
                  </Badge>
                )}
              </div>
              <div className="text-xs text-indigo-300 flex items-center gap-2">
                <Languages className="w-3.5 h-3.5" />
                <span>Lang: <strong className="uppercase">{post.analysis.language}</strong></span>
              </div>
            </div>

            {/* Score & Confidence Metric Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Sentiment Score</span>
                  <span className="font-mono text-white">
                    {post.analysis.sentiment_score > 0
                      ? `+${post.analysis.sentiment_score.toFixed(2)}`
                      : post.analysis.sentiment_score.toFixed(2)}{' '}
                    / 1.0
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all ${
                      post.analysis.sentiment === 'Positive'
                        ? 'bg-emerald-500'
                        : post.analysis.sentiment === 'Negative'
                        ? 'bg-rose-500'
                        : 'bg-slate-400'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(10, ((post.analysis.sentiment_score + 1) / 2) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>AI Confidence</span>
                  <span className="font-mono text-white">
                    {Math.round(post.analysis.confidence * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.round(post.analysis.confidence * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Explanation */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Gemini Reasoning
              </p>
              <p className="text-xs sm:text-sm text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                {post.analysis.explanation}
              </p>
            </div>

            {/* Emotions & Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Detected Emotions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.analysis.emotions.length > 0 ? (
                    post.analysis.emotions.map((em, i) => (
                      <Badge key={i} variant="purple" size="sm">
                        {em}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None identified</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Key Topics & Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.analysis.keywords.length > 0 ? (
                    post.analysis.keywords.map((kw, i) => (
                      <Badge key={i} variant="default" size="sm">
                        #{kw}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None extracted</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 rounded-xl border border-dashed border-slate-800 bg-slate-900/40">
            <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Post Awaiting Analysis</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Run Gemini AI analysis to extract sentiment score, detected emotions, and key topics.
            </p>
          </div>
        )}

        {/* Modal Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            className="text-xs bg-transparent border border-rose-800/60 text-rose-400 hover:bg-rose-950/40"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete Post
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleReanalyze}
              isLoading={isReanalyzing}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              {post.analysis ? 'Re-analyze' : 'Analyze Post'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
