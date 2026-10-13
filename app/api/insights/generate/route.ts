import { NextRequest, NextResponse } from 'next/server';
import { synthesizeProjectInsights } from '@/lib/gemini/analyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandOrTopic, posts } = body;

    const report = await synthesizeProjectInsights(
      brandOrTopic || 'Monitored Topic',
      Array.isArray(posts) ? posts : []
    );

    return NextResponse.json({ report });
  } catch (error: any) {
    console.error('API /api/insights/generate error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to synthesize insights.' },
      { status: 500 }
    );
  }
}
