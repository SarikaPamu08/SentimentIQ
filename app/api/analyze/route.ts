import { NextRequest, NextResponse } from 'next/server';
import { analyzePostSentiment } from '@/lib/gemini/analyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, brandOrTopic } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Post content is required.' },
        { status: 400 }
      );
    }

    const result = await analyzePostSentiment(content, brandOrTopic);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/analyze error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze post sentiment.' },
      { status: 500 }
    );
  }
}
