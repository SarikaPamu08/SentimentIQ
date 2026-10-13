'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProject } from '@/components/layout/project-context';

export function CreateProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createProject } = useProject();

  const [name, setName] = React.useState('');
  const [brandOrTopic, setBrandOrTopic] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [keywordsInput, setKeywordsInput] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brandOrTopic.trim()) {
      setError('Project name and Brand/Topic are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const keywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      await createProject({
        name: name.trim(),
        brand_or_topic: brandOrTopic.trim(),
        description: description.trim(),
        keywords,
      });

      // Reset & close
      setName('');
      setBrandOrTopic('');
      setDescription('');
      setKeywordsInput('');
      onClose();
    } catch {
      setError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Sentiment Project"
      description="Track and analyze audience sentiment for a brand, campaign, or product."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

        <Input
          id="project-name"
          label="Project Name *"
          placeholder="e.g., iPhone 16 Launch Tracker"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          id="project-brand"
          label="Brand, Product or Topic Name *"
          placeholder="e.g., iPhone 16 / Apple"
          value={brandOrTopic}
          onChange={(e) => setBrandOrTopic(e.target.value)}
          required
        />

        <Textarea
          id="project-desc"
          label="Description (Optional)"
          placeholder="Brief goals or background for this monitoring stream..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          id="project-keywords"
          label="Focus Keywords (Comma-separated)"
          placeholder="e.g., battery life, camera, overheating, price"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
        />

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
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
