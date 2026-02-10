import { NextRequest, NextResponse } from 'next/server';
import { generateProfessionalSummary } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, role, experience, skills } = body;

    if (!jobDescription || !role) {
      return NextResponse.json(
        { error: 'Job description and role are required' },
        { status: 400 }
      );
    }

    const summary = await generateProfessionalSummary(
      jobDescription,
      role,
      experience || '',
      skills || []
    );

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    );
  }
}
