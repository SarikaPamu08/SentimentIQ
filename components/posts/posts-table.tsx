'use client';

import * as React from 'react';
import {
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Trash2,
  Plus,
  Upload,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SentimentBadge, StatusBadge } from '@/components/ui/badge';
import { SocialPost, SocialPlatform, SentimentType, AnalysisStatus } from '@/types/sentiment';
import { formatDate } from '@/lib/utils';
import { useProject } from '@/components/layout/project-context';

export function PostsTable({
  posts,
  onOpenAddModal,
  onOpenCsvModal,
  onViewPost,
}: {
  posts: SocialPost[];
  onOpenAddModal: () => void;
  onOpenCsvModal: () => void;
  onViewPost: (post: SocialPost) => void;
}) {
  const { analyzePost, deletePost, analyzeAllPending, isAnalyzingBatch } = useProject();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [platformFilter, setPlatformFilter] = React.useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [sortOrder, setSortOrder] = React.useState<'newest' | 'oldest' | 'score_high' | 'score_low'>('newest');

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Filtered & Sorted posts
  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        post.content.toLowerCase().includes(search) ||
        (post.author && post.author.toLowerCase().includes(search)) ||
        (post.analysis &&
          post.analysis.keywords.some((k) => k.toLowerCase().includes(search)));

      // Platform
      const matchesPlatform =
        platformFilter === 'all' || post.platform === platformFilter;

      // Sentiment
      const matchesSentiment =
        sentimentFilter === 'all' ||
        post.analysis?.sentiment === sentimentFilter;

      // Status
      const matchesStatus =
        statusFilter === 'all' || post.status === statusFilter;

      return matchesSearch && matchesPlatform && matchesSentiment && matchesStatus;
    });
  }, [posts, searchTerm, platformFilter, sentimentFilter, statusFilter]);

  const sortedPosts = React.useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }
      if (sortOrder === 'oldest') {
        return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
      }
      if (sortOrder === 'score_high') {
        const scoreA = a.analysis?.sentiment_score ?? -99;
        const scoreB = b.analysis?.sentiment_score ?? -99;
        return scoreB - scoreA;
      }
      if (sortOrder === 'score_low') {
        const scoreA = a.analysis?.sentiment_score ?? 99;
        const scoreB = b.analysis?.sentiment_score ?? 99;
        return scoreA - scoreB;
      }
      return 0;
    });
  }, [filteredPosts, sortOrder]);

  const totalPages = Math.ceil(sortedPosts.length / pageSize) || 1;
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const pendingCount = posts.filter((p) => p.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Top action bar: Search, Filters, and Add/Import buttons */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search posts or keywords..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Platform filter */}
          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Platforms</option>
            <option value="X">X (Twitter)</option>
            <option value="Reddit">Reddit</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
            <option value="Other">Other</option>
          </select>

          {/* Sentiment filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => {
              setSentimentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Analyzed</option>
            <option value="failed">Failed</option>
          </select>

          {/* Sort order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="score_high">Sort: Highest Sentiment</option>
            <option value="score_low">Sort: Lowest Sentiment</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Button
              size="sm"
              variant="primary"
              onClick={analyzeAllPending}
              isLoading={isAnalyzingBatch}
              className="text-xs bg-indigo-600 hover:bg-indigo-500"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Analyze All ({pendingCount})
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCsvModal}
            className="text-xs border-slate-700 hover:bg-slate-800"
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            Import CSV
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={onOpenAddModal}
            className="text-xs bg-emerald-600 hover:bg-emerald-500"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Post
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Post Content</th>
                <th className="py-3 px-3">Platform</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Sentiment & Score</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onViewPost(post)}
                  >
                    <td className="py-3.5 px-4 max-w-sm lg:max-w-md">
                      <p className="line-clamp-2 text-slate-200 text-xs sm:text-sm leading-relaxed">
                        {post.content}
                      </p>
                      {post.analysis?.sarcasm_detected && (
                        <span className="inline-block mt-1 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/50 px-1.5 py-0.2 rounded font-mono">
                          Sarcasm Detected
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {post.platform}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-xs text-slate-400">
                      {post.author || '—'}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {post.analysis ? (
                        <SentimentBadge
                          sentiment={post.analysis.sentiment}
                          score={post.analysis.sentiment_score}
                        />
                      ) : (
                        <StatusBadge status={post.status} />
                      )}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-xs">
                      {post.analysis ? (
                        <span className="font-mono text-slate-300">
                          {Math.round(post.analysis.confidence * 100)}%
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-xs text-slate-400">
                      {formatDate(post.published_at)}
                    </td>

                    <td
                      className="py-3.5 px-4 whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {post.status === 'pending' ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => analyzePost(post.id)}
                            className="text-xs h-7 px-2 bg-indigo-600 hover:bg-indigo-500"
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
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Delete this post?')) deletePost(post.id);
                          }}
                          className="text-xs h-7 px-2 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-300">No matching posts found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try adjusting your search query or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
          <span>
            Showing <strong className="text-slate-200">{paginatedPosts.length}</strong> of{' '}
            <strong className="text-slate-200">{sortedPosts.length}</strong> posts
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="px-2 text-slate-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 px-2 text-xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
