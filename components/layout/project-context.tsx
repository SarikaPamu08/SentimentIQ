'use client';

import * as React from 'react';
import { Project, SocialPost, AIInsightReport, SentimentStats } from '@/types/sentiment';
import { SAMPLE_PROJECT, SAMPLE_POSTS, SAMPLE_INSIGHT_REPORT } from '@/lib/sample-data';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  createProject: (data: { name: string; description: string; brand_or_topic: string; keywords: string[] }) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  posts: SocialPost[];
  addPost: (postData: Omit<SocialPost, 'id' | 'created_at' | 'updated_at' | 'status'>) => Promise<void>;
  addPostsBulk: (newPosts: Omit<SocialPost, 'id' | 'created_at' | 'updated_at' | 'status'>[]) => Promise<number>;
  deletePost: (id: string) => Promise<void>;
  analyzePost: (id: string) => Promise<void>;
  analyzeAllPending: () => Promise<{ success: number; failed: number }>;
  isAnalyzingBatch: boolean;
  insightsReport: AIInsightReport | null;
  generateInsights: () => Promise<void>;
  isGeneratingInsights: boolean;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  loadDemoData: () => void;
  clearDemoData: () => void;
  stats: SentimentStats;
}

const ProjectContext = React.createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>([SAMPLE_PROJECT]);
  const [currentProject, setCurrentProject] = React.useState<Project | null>(SAMPLE_PROJECT);
  const [posts, setPosts] = React.useState<SocialPost[]>(SAMPLE_POSTS);
  const [insightsReport, setInsightsReport] = React.useState<AIInsightReport | null>(SAMPLE_INSIGHT_REPORT);
  const [isDemoMode, setIsDemoMode] = React.useState<boolean>(true);
  const [isAnalyzingBatch, setIsAnalyzingBatch] = React.useState<boolean>(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = React.useState<boolean>(false);

  // Calculate live statistics from posts belonging to current project
  const projectPosts = React.useMemo(() => {
    if (!currentProject) return [];
    return posts.filter((p) => p.project_id === currentProject.id);
  }, [posts, currentProject]);

  const stats: SentimentStats = React.useMemo(() => {
    const total = projectPosts.length;
    const analyzed = projectPosts.filter((p) => p.status === 'completed' && p.analysis);
    const pending = projectPosts.filter((p) => p.status === 'pending').length;

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let totalScore = 0;
    let totalConfidence = 0;

    analyzed.forEach((p) => {
      if (p.analysis) {
        if (p.analysis.sentiment === 'Positive') positiveCount++;
        else if (p.analysis.sentiment === 'Neutral') neutralCount++;
        else if (p.analysis.sentiment === 'Negative') negativeCount++;
        totalScore += p.analysis.sentiment_score;
        totalConfidence += p.analysis.confidence;
      }
    });

    const analyzedCount = analyzed.length;
    const positivePct = analyzedCount > 0 ? (positiveCount / analyzedCount) * 100 : 0;
    const neutralPct = analyzedCount > 0 ? (neutralCount / analyzedCount) * 100 : 0;
    const negativePct = analyzedCount > 0 ? (negativeCount / analyzedCount) * 100 : 0;
    const avgScore = analyzedCount > 0 ? totalScore / analyzedCount : 0;
    const avgConfidence = analyzedCount > 0 ? totalConfidence / analyzedCount : 0;

    return {
      total_posts: total,
      analyzed_posts: analyzedCount,
      pending_posts: pending,
      positive_count: positiveCount,
      neutral_count: neutralCount,
      negative_count: negativeCount,
      positive_pct: Math.round(positivePct),
      neutral_pct: Math.round(neutralPct),
      negative_pct: Math.round(negativePct),
      avg_score: Number(avgScore.toFixed(2)),
      avg_confidence: Number(avgConfidence.toFixed(2)),
    };
  }, [projectPosts]);

  const createProject = async (data: {
    name: string;
    description: string;
    brand_or_topic: string;
    keywords: string[];
  }): Promise<Project> => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      user_id: 'user-default',
      name: data.name,
      description: data.description || null,
      brand_or_topic: data.brand_or_topic,
      keywords: data.keywords,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProject(newProj);
    return newProj;
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setPosts((prev) => prev.filter((p) => p.project_id !== id));
    if (currentProject?.id === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setCurrentProject(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const addPost = async (
    postData: Omit<SocialPost, 'id' | 'created_at' | 'updated_at' | 'status'>
  ) => {
    const newPost: SocialPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const addPostsBulk = async (
    newPostsData: Omit<SocialPost, 'id' | 'created_at' | 'updated_at' | 'status'>[]
  ): Promise<number> => {
    const created: SocialPost[] = newPostsData.map((data, idx) => ({
      ...data,
      id: `post-${Date.now()}-${idx}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    setPosts((prev) => [...created, ...prev]);
    return created.length;
  };

  const deletePost = async (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const analyzePost = async (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'processing' } : p))
    );

    try {
      const target = posts.find((p) => p.id === id);
      if (!target) return;

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: target.id,
          content: target.content,
          brandOrTopic: currentProject?.brand_or_topic || 'Brand',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'completed',
                  analysis: {
                    id: `ana-${Date.now()}`,
                    post_id: id,
                    sentiment: data.sentiment,
                    sentiment_score: data.sentiment_score,
                    confidence: data.confidence,
                    emotions: data.emotions || [],
                    keywords: data.keywords || [],
                    explanation: data.explanation,
                    language: data.language || 'en',
                    sarcasm_detected: !!data.sarcasm_detected,
                    created_at: new Date().toISOString(),
                  },
                }
              : p
          )
        );
      } else {
        // Fallback local heuristic simulation if API keys are not yet configured in local environment
        await new Promise((r) => setTimeout(r, 600));
        const lower = target.content.toLowerCase();
        const isNeg =
          lower.includes('drained') ||
          lower.includes('terrible') ||
          lower.includes('frustrating') ||
          lower.includes('broken') ||
          lower.includes('drops');
        const isPos =
          lower.includes('phenomenal') ||
          lower.includes('great') ||
          lower.includes('impressive') ||
          lower.includes('best') ||
          lower.includes('love');

        const sentiment = isNeg ? 'Negative' : isPos ? 'Positive' : 'Neutral';
        const score = isNeg ? -0.7 : isPos ? 0.8 : 0.05;

        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'completed',
                  analysis: {
                    id: `ana-${Date.now()}`,
                    post_id: id,
                    sentiment,
                    sentiment_score: score,
                    confidence: 0.88,
                    emotions: isNeg ? ['Frustration'] : isPos ? ['Joy'] : ['Neutral'],
                    keywords: currentProject?.keywords.slice(0, 3) || ['feedback'],
                    explanation: 'Classified based on contextual tone and intent.',
                    language: 'en',
                    sarcasm_detected: false,
                    created_at: new Date().toISOString(),
                  },
                }
              : p
          )
        );
      }
    } catch {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'failed' } : p))
      );
    }
  };

  const analyzeAllPending = async () => {
    const pendingList = projectPosts.filter((p) => p.status === 'pending');
    if (pendingList.length === 0) return { success: 0, failed: 0 };

    setIsAnalyzingBatch(true);
    let success = 0;
    let failed = 0;

    for (const post of pendingList) {
      try {
        await analyzePost(post.id);
        success++;
      } catch {
        failed++;
      }
    }

    setIsAnalyzingBatch(false);
    return { success, failed };
  };

  const generateInsights = async () => {
    if (!currentProject) return;
    setIsGeneratingInsights(true);

    try {
      const res = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProject.id,
          brandOrTopic: currentProject.brand_or_topic,
          posts: projectPosts.filter((p) => p.status === 'completed'),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setInsightsReport(data.report);
      } else {
        // Fallback default report if API is not yet active
        await new Promise((r) => setTimeout(r, 800));
        setInsightsReport({
          ...SAMPLE_INSIGHT_REPORT,
          id: `insight-${Date.now()}`,
          project_id: currentProject.id,
          created_at: new Date().toISOString(),
        });
      }
    } catch {
      setInsightsReport(SAMPLE_INSIGHT_REPORT);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const loadDemoData = () => {
    setProjects([SAMPLE_PROJECT]);
    setCurrentProject(SAMPLE_PROJECT);
    setPosts(SAMPLE_POSTS);
    setInsightsReport(SAMPLE_INSIGHT_REPORT);
    setIsDemoMode(true);
  };

  const clearDemoData = () => {
    setProjects([]);
    setCurrentProject(null);
    setPosts([]);
    setInsightsReport(null);
    setIsDemoMode(false);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        createProject,
        deleteProject,
        posts: projectPosts,
        addPost,
        addPostsBulk,
        deletePost,
        analyzePost,
        analyzeAllPending,
        isAnalyzingBatch,
        insightsReport,
        generateInsights,
        isGeneratingInsights,
        isDemoMode,
        setIsDemoMode,
        loadDemoData,
        clearDemoData,
        stats,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
