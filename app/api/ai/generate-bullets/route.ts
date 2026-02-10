import { NextRequest, NextResponse } from 'next/server';
import { generateBulletPoints } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, experienceDescription, jobTitle, company } = body;

    if (!jobDescription || !experienceDescription || !jobTitle) {
      return NextResponse.json(
        { error: 'Job description, experience description, and job title are required' },
        { status: 400 }
      );
    }

    const bulletPoints = await generateBulletPoints(
      jobDescription,
      experienceDescription,
      jobTitle,
      company || ''
    );

    return NextResponse.json({ bulletPoints });
  } catch (error) {
    console.error('Error generating bullet points:', error);
    return NextResponse.json(
      { error: 'Failed to generate bullet points. Please try again.' },
      { status: 500 }
    );
  }
}
