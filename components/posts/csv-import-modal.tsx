'use client';

import * as React from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { SocialPlatform, SocialPost } from '@/types/sentiment';
import { useProject } from '@/components/layout/project-context';
import { SAMPLE_CSV_CONTENT } from '@/lib/sample-data';

export function CsvImportModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { currentProject, addPostsBulk, posts: existingPosts } = useProject();

  const [file, setFile] = React.useState<File | null>(null);
  const [parsedRows, setParsedRows] = React.useState<any[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [importStats, setImportStats] = React.useState<{ imported: number; skipped: number } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Please select a valid .csv file format.']);
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setImportStats(null);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setErrors(results.errors.map((err) => `Row ${err.row}: ${err.message}`));
        }
        setParsedRows(results.data);
      },
      error: (err) => {
        setErrors([`Failed to parse CSV file: ${err.message}`]);
      },
    });
  };

  const downloadSampleTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sentimentiq_sample_posts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    if (!currentProject || parsedRows.length === 0) return;

    setIsProcessing(true);
    setErrors([]);

    const validPlatforms: SocialPlatform[] = [
      'X',
      'Reddit',
      'Instagram',
      'YouTube',
      'LinkedIn',
      'Facebook',
      'Other',
    ];

    const newPosts: Omit<SocialPost, 'id' | 'created_at' | 'updated_at' | 'status'>[] = [];
    let skippedDuplicates = 0;

    const existingContents = new Set(existingPosts.map((p) => p.content.trim().toLowerCase()));

    parsedRows.forEach((row) => {
      // Find content column (case-insensitive)
      const content =
        row.content || row.Content || row.text || row.Text || row.post || row.Post;

      if (!content || !content.trim()) return;

      const trimmedContent = content.trim();

      // Duplicate handling
      if (existingContents.has(trimmedContent.toLowerCase())) {
        skippedDuplicates++;
        return;
      }
      existingContents.add(trimmedContent.toLowerCase());

      const rawPlatform = (row.platform || row.Platform || 'Other').trim();
      const platform: SocialPlatform = validPlatforms.includes(rawPlatform as SocialPlatform)
        ? (rawPlatform as SocialPlatform)
        : 'Other';

      const author = row.author || row.Author || row.user || row.User || null;
      const postUrl = row.post_url || row.url || row.URL || null;
      const rawDate = row.published_at || row.date || row.Date || new Date().toISOString();

      let publishedAt: string;
      try {
        publishedAt = new Date(rawDate).toISOString();
      } catch {
        publishedAt = new Date().toISOString();
      }

      newPosts.push({
        project_id: currentProject.id,
        user_id: currentProject.user_id,
        content: trimmedContent,
        platform,
        author: author ? author.trim() : null,
        post_url: postUrl ? postUrl.trim() : null,
        published_at: publishedAt,
      });
    });

    if (newPosts.length === 0 && skippedDuplicates > 0) {
      setErrors([`All ${skippedDuplicates} posts in this CSV already exist in this project.`]);
      setIsProcessing(false);
      return;
    }

    try {
      const importedCount = await addPostsBulk(newPosts);
      setImportStats({ imported: importedCount, skipped: skippedDuplicates });
      setTimeout(() => {
        onClose();
        setFile(null);
        setParsedRows([]);
        setImportStats(null);
      }, 1500);
    } catch {
      setErrors(['Failed to import records into the project.']);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Posts from CSV"
      description="Upload a CSV file containing social media posts for batch processing."
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Expected Format Guide */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Expected Column Headers
            </span>
            <button
              onClick={downloadSampleTemplate}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template CSV
            </button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your file should include columns: <code className="text-indigo-300 font-mono">content</code> (required),{' '}
            <code className="text-indigo-300 font-mono">platform</code> (X, Reddit, Instagram, etc.),{' '}
            <code className="text-indigo-300 font-mono">author</code>,{' '}
            <code className="text-indigo-300 font-mono">post_url</code>, and{' '}
            <code className="text-indigo-300 font-mono">published_at</code>.
          </p>
        </div>

        {/* Drag and Drop / File Input Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-950/40"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-medium text-white">
            {file ? file.name : 'Click to select or drag & drop CSV file'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Maximum file size: 5 MB</p>
        </div>

        {/* Parse Preview */}
        {parsedRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="w-4 h-4 text-indigo-400" />
                Parsed {parsedRows.length} rows ready for import
              </span>
            </div>

            {/* Preview table snippet */}
            <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-medium">
                  <tr>
                    <th className="py-2 px-3">Content</th>
                    <th className="py-2 px-3">Platform</th>
                    <th className="py-2 px-3">Author</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {parsedRows.slice(0, 4).map((row, idx) => (
                    <tr key={idx} className="text-slate-300">
                      <td className="py-2 px-3 truncate max-w-xs">
                        {row.content || row.Content || row.text || '—'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        {row.platform || row.Platform || 'Other'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-400">
                        {row.author || row.Author || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Errors list */}
        {errors.length > 0 && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-rose-200">
              <AlertCircle className="w-4 h-4" />
              Import Errors
            </div>
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        {/* Success feedback */}
        {importStats && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Successfully imported {importStats.imported} posts! ({importStats.skipped} duplicates skipped).
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleImport}
            disabled={parsedRows.length === 0 || isProcessing}
            isLoading={isProcessing}
          >
            Import {parsedRows.length > 0 ? `${parsedRows.length} Posts` : 'CSV'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
