'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { SocialPlatform } from '@/types/sentiment';
import { useProject } from '@/components/layout/project-context';

export function AddPostModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { currentProject, addPost } = useProject();

  const [content, setContent] = React.useState('');
  const [platform, setPlatform] = React.useState<SocialPlatform>('X');
  const [author, setAuthor] = React.useState('');
  const [postUrl, setPostUrl] = React.useState('');
  const [publishedAt, setPublishedAt] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && !publishedAt) {
      setPublishedAt(new Date().toISOString().slice(0, 16));
    }
  }, [isOpen, publishedAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) {
      setError('Please select or create a project first.');
      return;
    }
    if (!content.trim()) {
      setError('Post content is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addPost({
        project_id: currentProject.id,
        user_id: currentProject.user_id,
        content: content.trim(),
        platform,
        author: author.trim() || null,
        post_url: postUrl.trim() || null,
        published_at: new Date(publishedAt).toISOString(),
      });

      // Reset form & close
      setContent('');
      setAuthor('');
      setPostUrl('');
      onClose();
    } catch {
      setError('Failed to save post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const platforms: { value: SocialPlatform; label: string }[] = [
    { value: 'X', label: 'X (Twitter)' },
    { value: 'Reddit', label: 'Reddit' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Social Media Post"
      description={`Add a post to track under "${currentProject?.name || 'Current Project'}"`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

        <Textarea
          id="post-content"
          label="Post Text Content *"
          placeholder="Paste or write the customer feedback, tweet, review, or comment..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="platform"
            label="Platform *"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
            options={platforms}
          />

          <Input
            id="author"
            label="Author / Handle (Optional)"
            placeholder="@handle or username"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="postUrl"
            label="Post URL (Optional)"
            placeholder="https://..."
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
          />

          <Input
            id="publishedAt"
            label="Published Timestamp"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Post
          </Button>
        </div>
      </form>
    </Modal>
  );
}
