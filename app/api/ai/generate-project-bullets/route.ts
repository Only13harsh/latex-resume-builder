import { NextRequest, NextResponse } from 'next/server';
import { generateProjectBullets } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectDescription, projectTitle, technologies } = body;

    if (!projectDescription || !projectTitle) {
      return NextResponse.json(
        { error: 'Project description and title are required' },
        { status: 400 }
      );
    }

    const bulletPoints = await generateProjectBullets(
      projectDescription,
      projectTitle,
      technologies || []
    );

    return NextResponse.json({ bulletPoints });
  } catch (error) {
    console.error('Error generating project bullets:', error);
    return NextResponse.json(
      { error: 'Failed to generate project bullets. Please try again.' },
      { status: 500 }
    );
  }
}
