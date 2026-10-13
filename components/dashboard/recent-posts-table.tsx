'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SentimentBadge, StatusBadge } from '@/components/ui/badge';
import { SocialPost } from '@/types/sentiment';
import { formatDate } from '@/lib/utils';
import { useProject } from '@/components/layout/project-context';

export function RecentPostsTable({
  posts,
  onViewPost,
}: {
  posts: SocialPost[];
  onViewPost: (post: SocialPost) => void;
}) {
  const { analyzePost } = useProject();
  const recentPosts = posts.slice(0, 5);

  return (
    <Card>
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div>
          <CardTitle>Recent Posts Activity</CardTitle>
          <CardDescription>
            Latest collected social media posts and automated analysis results
          </CardDescription>
        </div>
        <Link href="/posts">
          <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300">
            View All ({posts.length})
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {recentPosts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold">
                <th className="py-3 px-3">Content</th>
                <th className="py-3 px-3">Platform</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Sentiment</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onViewPost(post)}
                >
                  <td className="py-3 px-3 max-w-xs md:max-w-md">
                    <p className="line-clamp-2 text-slate-200 text-xs sm:text-sm">
                      {post.content}
                    </p>
                    {post.analysis?.sarcasm_detected && (
                      <span className="inline-block mt-1 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/50 px-1.5 py-0.2 rounded font-mono">
                        Sarcasm Detected
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {post.platform}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-xs text-slate-400">
                    {post.author || 'Anonymous'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {post.analysis ? (
                      <SentimentBadge
                        sentiment={post.analysis.sentiment}
                        score={post.analysis.sentiment_score}
                      />
                    ) : (
                      <StatusBadge status={post.status} />
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-xs text-slate-400">
                    {formatDate(post.published_at)}
                  </td>
                  <td
                    className="py-3 px-3 whitespace-nowrap text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {post.status === 'pending' ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => analyzePost(post.id)}
                        className="text-xs h-7 px-2.5 bg-indigo-600 hover:bg-indigo-500"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Analyze
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewPost(post)}
                        className="text-xs h-7 px-2 text-slate-400 hover:text-white"
                      >
                        Details
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm font-medium text-slate-300">No Posts in this Project</p>
          <p className="text-xs text-slate-500 mt-1">
            Add manual posts or import a CSV from the Posts section.
          </p>
          <Link href="/posts" className="inline-block mt-4">
            <Button size="sm" variant="outline">
              Go to Posts & Feed
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
