import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { role, company, jobDescription, personalInfo } = await request.json()

    const systemPrompt = `You are an expert resume writer specializing in ATS-friendly resumes. Your task is to generate professional summaries and extract key skills from job descriptions.`

    const userPrompt = `Based on the following information, generate:
1. A compelling 2-4 sentence professional summary for a resume (tailored to the role)
2. A list of 8-12 key skills/keywords from the job description that should be emphasized

Target Role: ${role}${company ? ` at ${company}` : ''}
Candidate Name: ${personalInfo.fullName}
Professional Title: ${personalInfo.professionalTitle}

Job Description:
${jobDescription}

Return your response in the following JSON format:
{
  "summary": "2-4 sentence professional summary here",
  "keywords": ["keyword1", "keyword2", "keyword3", ...]
}

Guidelines:
- Make the summary specific to the role and impactful
- Focus on relevant achievements and skills
- Extract keywords that appear in the job description
- Keywords should be technical skills, tools, methodologies, or key requirements
- Keep it truthful and professional`

    const response = await fetch('https://llm.blackbox.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'customerId': 'cus_TiS2BshC1sXuLc',
        'Authorization': 'Bearer xxx',
      },
      body: JSON.stringify({
        model: 'openrouter/claude-sonnet-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error('AI service error')
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    // Try to extract JSON from the response
    let result
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        result = JSON.parse(content)
      }
    } catch (e) {
      // If JSON parsing fails, create a default response
      result = {
        summary: content.split('\n')[0] || 'Professional with expertise in the field',
        keywords: ['Problem Solving', 'Communication', 'Leadership'],
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
