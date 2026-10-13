'use client';

import * as React from 'react';
import { Project, SocialPost, AIInsightReport, SentimentStats } from '@/types/sentiment';
import { SAMPLE_PROJECT, SAMPLE_POSTS, SAMPLE_INSIGHT_REPORT } from '@/lib/sample-data';
import { createClient } from '@/lib/supabase/client';

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
  user: any | null;
  signOut: () => Promise<void>;
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
  const [user, setUser] = React.useState<any | null>(null);

  // Sync with Supabase on mount
  React.useEffect(() => {
    async function initSupabase() {
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          setUser(currentUser);
          setIsDemoMode(false);

          // Fetch user's projects
          const { data: dbProjects } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (dbProjects && dbProjects.length > 0) {
            setProjects(dbProjects);
            setCurrentProject(dbProjects[0]);
          } else {
            setProjects([]);
            setCurrentProject(null);
          }
        }
      } catch (err) {
        console.log('Running in local/demo mode (Supabase connection not active):', err);
      }
    }

    initSupabase();
  }, []);

  // Fetch posts when currentProject changes if authenticated
  React.useEffect(() => {
    async function fetchProjectPosts() {
      if (!currentProject || isDemoMode || !user) return;

      try {
        const supabase = createClient();
        const { data: dbPosts, error } = await supabase
          .from('posts')
          .select(`
            *,
            sentiment_analyses (*)
          `)
          .eq('project_id', currentProject.id)
          .order('published_at', { ascending: false });

        if (!error && dbPosts) {
          const mapped: SocialPost[] = dbPosts.map((p: any) => ({
            id: p.id,
            project_id: p.project_id,
            user_id: p.user_id,
            content: p.content,
            platform: p.platform,
            author: p.author,
            post_url: p.post_url,
            published_at: p.published_at,
            status: p.status,
            error_message: p.error_message,
            created_at: p.created_at,
            updated_at: p.updated_at,
            analysis: p.sentiment_analyses?.[0] || p.sentiment_analyses || null,
          }));
          setPosts(mapped);
        }
      } catch (err) {
        console.error('Error fetching project posts from Supabase:', err);
      }
    }

    fetchProjectPosts();
  }, [currentProject, isDemoMode, user]);

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
    if (user && !isDemoMode) {
      try {
        const supabase = createClient();
        const { data: created, error } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            name: data.name,
            description: data.description || null,
            brand_or_topic: data.brand_or_topic,
            keywords: data.keywords,
          })
          .select()
          .single();

        if (!error && created) {
          setProjects((prev) => [created, ...prev]);
          setCurrentProject(created);
          return created;
        }
      } catch (err) {
        console.error('Supabase project creation failed:', err);
      }
    }

    // Local / Demo state fallback
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      user_id: user?.id || 'demo-user-id',
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
    if (user && !isDemoMode) {
      try {
        const supabase = createClient();
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase project deletion error:', err);
      }
    }

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
    if (user && !isDemoMode) {
      try {
        const supabase = createClient();
        const { data: created, error } = await supabase
          .from('posts')
          .insert({
            project_id: postData.project_id,
            user_id: user.id,
            content: postData.content,
            platform: postData.platform,
            author: postData.author,
            post_url: postData.post_url,
            published_at: postData.published_at,
            status: 'pending',
          })
          .select()
          .single();

        if (!error && created) {
          setPosts((prev) => [created, ...prev]);
          return;
        }
      } catch (err) {
        console.error('Supabase add post error:', err);
      }
    }

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
    if (user && !isDemoMode && newPostsData.length > 0) {
      try {
        const supabase = createClient();
        const payload = newPostsData.map((d) => ({
          project_id: d.project_id,
          user_id: user.id,
          content: d.content,
          platform: d.platform,
          author: d.author,
          post_url: d.post_url,
          published_at: d.published_at,
          status: 'pending',
        }));

        const { data: created, error } = await supabase
          .from('posts')
          .insert(payload)
          .select();

        if (!error && created) {
          setPosts((prev) => [...created, ...prev]);
          return created.length;
        }
      } catch (err) {
        console.error('Supabase bulk insert error:', err);
      }
    }

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
    if (user && !isDemoMode) {
      try {
        const supabase = createClient();
        await supabase.from('posts').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete post error:', err);
      }
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const analyzePost = async (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'processing' } : p))
    );

    const target = posts.find((p) => p.id === id);
    if (!target) return;

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: target.id,
          content: target.content,
          brandOrTopic: currentProject?.brand_or_topic || 'Brand',
        }),
      });

      if (!res.ok) throw new Error('Analysis API error');

      const data = await res.json();

      const analysisObj = {
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
      };

      // Persist in Supabase if live
      if (user && !isDemoMode) {
        try {
          const supabase = createClient();
          await supabase.from('sentiment_analyses').upsert({
            post_id: id,
            sentiment: data.sentiment,
            sentiment_score: data.sentiment_score,
            confidence: data.confidence,
            emotions: data.emotions,
            keywords: data.keywords,
            explanation: data.explanation,
            language: data.language,
            sarcasm_detected: data.sarcasm_detected,
          });

          await supabase
            .from('posts')
            .update({ status: 'completed' })
            .eq('id', id);
        } catch (dbErr) {
          console.error('Failed to persist analysis to Supabase:', dbErr);
        }
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: 'completed',
                analysis: analysisObj,
              }
            : p
        )
      );
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
        const report = {
          ...data.report,
          id: `insight-${Date.now()}`,
          project_id: currentProject.id,
          user_id: user?.id || 'demo-user-id',
          post_count_analyzed: projectPosts.filter((p) => p.status === 'completed').length,
          created_at: new Date().toISOString(),
        };

        if (user && !isDemoMode) {
          const supabase = createClient();
          await supabase.from('ai_insights').insert({
            project_id: currentProject.id,
            user_id: user.id,
            title: report.title,
            summary: report.summary,
            positive_themes: report.positive_themes,
            negative_themes: report.negative_themes,
            emerging_topics: report.emerging_topics,
            recommendations: report.recommendations,
            suggested_responses: report.suggested_responses,
            post_count_analyzed: report.post_count_analyzed,
          });
        }

        setInsightsReport(report);
      }
    } catch (err) {
      console.error('Insights generation error:', err);
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

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    loadDemoData();
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
        user,
        signOut,
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
