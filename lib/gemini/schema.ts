import { z } from 'zod';

export const SentimentAnalysisSchema = z.object({
  sentiment: z.enum(['Positive', 'Neutral', 'Negative']),
  sentiment_score: z.number().min(-1.0).max(1.0),
  confidence: z.number().min(0.0).max(1.0),
  emotions: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  explanation: z.string(),
  language: z.string().default('en'),
  sarcasm_detected: z.boolean().default(false),
});

export type ValidatedSentimentResult = z.infer<typeof SentimentAnalysisSchema>;

export const AIInsightReportSchema = z.object({
  title: z.string(),
  summary: z.string(),
  positive_themes: z.array(
    z.object({
      theme: z.string(),
      description: z.string(),
      frequency: z.string(),
    })
  ).default([]),
  negative_themes: z.array(
    z.object({
      complaint: z.string(),
      impact: z.enum(['High', 'Medium', 'Low']),
      suggested_action: z.string(),
    })
  ).default([]),
  emerging_topics: z.array(z.string()).default([]),
  recommendations: z.array(
    z.object({
      category: z.enum(['Immediate', 'Strategic', 'Communication']),
      action: z.string(),
      rationale: z.string(),
    })
  ).default([]),
  suggested_responses: z.array(
    z.object({
      scenario: z.string(),
      sample_response: z.string(),
      tone: z.string(),
    })
  ).default([]),
});

export type ValidatedInsightReport = z.infer<typeof AIInsightReportSchema>;
