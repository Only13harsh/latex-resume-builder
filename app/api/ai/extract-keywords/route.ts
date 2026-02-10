import { NextRequest, NextResponse } from 'next/server';
import { extractKeywords } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    const keywords = await extractKeywords(jobDescription);

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return NextResponse.json(
      { error: 'Failed to extract keywords. Please try again.' },
      { status: 500 }
    );
  }
}
