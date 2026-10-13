export type SocialPlatform =
  | 'X'
  | 'Instagram'
  | 'Facebook'
  | 'YouTube'
  | 'LinkedIn'
  | 'Reddit'
  | 'Other';

export type SentimentType = 'Positive' | 'Neutral' | 'Negative';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  brand_or_topic: string;
  keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface SentimentAnalysis {
  id: string;
  post_id: string;
  sentiment: SentimentType;
  sentiment_score: number; // -1.0 to 1.0
  confidence: number;      // 0.0 to 1.0
  emotions: string[];
  keywords: string[];
  explanation: string;
  language: string;
  sarcasm_detected: boolean;
  created_at: string;
}

export interface SocialPost {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  platform: SocialPlatform;
  author: string | null;
  post_url: string | null;
  published_at: string;
  status: AnalysisStatus;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
  analysis?: SentimentAnalysis | null;
}

export interface AIInsightReport {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  summary: string;
  positive_themes: {
    theme: string;
    description: string;
    frequency: string;
  }[];
  negative_themes: {
    complaint: string;
    impact: 'High' | 'Medium' | 'Low';
    suggested_action: string;
  }[];
  emerging_topics: string[];
  recommendations: {
    category: 'Immediate' | 'Strategic' | 'Communication';
    action: string;
    rationale: string;
  }[];
  suggested_responses: {
    scenario: string;
    sample_response: string;
    tone: string;
  }[];
  post_count_analyzed: number;
  created_at: string;
}

export interface SentimentStats {
  total_posts: number;
  analyzed_posts: number;
  pending_posts: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
  avg_score: number;
  avg_confidence: number;
}
