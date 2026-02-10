import { NextRequest, NextResponse } from 'next/server';
import { generateLatexCode } from '@/lib/latex-generator';
import { ResumeData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const resumeData: ResumeData = await request.json();

    // Validate required fields
    if (!resumeData.personalInfo || !resumeData.personalInfo.fullName) {
      return NextResponse.json(
        { error: 'Personal information is required' },
        { status: 400 }
      );
    }

    const latex = generateLatexCode(resumeData);

    return NextResponse.json({ latex });
  } catch (error) {
    console.error('Error generating LaTeX:', error);
    return NextResponse.json(
      { error: 'Failed to generate LaTeX code. Please check your input.' },
      { status: 500 }
    );
  }
}
