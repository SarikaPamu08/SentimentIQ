'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Plus,
  Trash2,
  ExternalLink,
  Tag,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useProject } from '@/components/layout/project-context';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { formatDate } from '@/lib/utils';
import { Project } from '@/types/sentiment';

export default function ProjectsPage() {
  const router = useRouter();
  const {
    projects,
    currentProject,
    setCurrentProject,
    deleteProject,
    posts,
  } = useProject();

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleSelectProject = (proj: Project) => {
    setCurrentProject(proj);
    router.push('/');
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project and all its tracked posts?')) {
      await deleteProject(id);
    }
  };

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <FolderKanban className="w-7 h-7 text-indigo-400" />
            Project Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize sentiment tracking campaigns by brand, product, or market event.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Create New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const isSelected = currentProject?.id === proj.id;
          const projectPostsCount = posts.filter((p) => p.project_id === proj.id).length;

          return (
            <Card
              key={proj.id}
              className={`flex flex-col justify-between cursor-pointer transition-all hover:border-indigo-500/80 ${
                isSelected
                  ? 'border-indigo-500/80 bg-slate-900/90 ring-1 ring-indigo-500/30'
                  : 'border-slate-800'
              }`}
              onClick={() => handleSelectProject(proj)}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {proj.name}
                      {isSelected && (
                        <span className="text-[10px] bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 px-1.5 py-0.5 rounded font-mono font-normal">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                      Target: {proj.brand_or_topic}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, proj.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {proj.description || 'No description provided.'}
                </p>

                {/* Keywords Tags */}
                {proj.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {proj.keywords.slice(0, 4).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                      >
                        #{kw}
                      </span>
                    ))}
                    {proj.keywords.length > 4 && (
                      <span className="text-[11px] text-slate-500 px-1">
                        +{proj.keywords.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(proj.created_at)}
                </span>

                <Button
                  variant={isSelected ? 'secondary' : 'outline'}
                  size="sm"
                  className="text-xs h-7 px-2.5"
                  onClick={() => handleSelectProject(proj)}
                >
                  {isSelected ? 'Opened' : 'Open Dashboard'}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </DashboardShell>
  );
}
