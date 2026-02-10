import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { jobTitle, company, description, targetRole, jobDescription, level } = await request.json()

    const systemPrompt = `You are an expert resume writer specializing in creating ATS-friendly, impact-focused bullet points for resumes.`

    const userPrompt = `Transform the following work experience description into 3-6 strong, ATS-friendly bullet points.

Current Role: ${jobTitle} at ${company}
Experience Level: ${level}
Target Role: ${targetRole}

Job Description of Target Role:
${jobDescription}

Current Experience Description:
${description}

Guidelines for bullet points:
1. Start with strong action verbs (Led, Developed, Implemented, Achieved, etc.)
2. Include measurable impact where possible (percentages, numbers, scale)
3. Keep each bullet to 1-2 lines (70-180 characters)
4. Align with keywords from the target role
5. Focus on achievements and outcomes, not just responsibilities
6. Use industry-standard terminology
7. Do not invent fake metrics - only suggest measurable impact if the description hints at it
8. Do not end with periods

Return ONLY a JSON array of strings:
["Bullet point 1", "Bullet point 2", "Bullet point 3", ...]`

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

    // Try to extract JSON array from the response
    let bulletPoints
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        bulletPoints = JSON.parse(jsonMatch[0])
      } else {
        bulletPoints = JSON.parse(content)
      }
    } catch (e) {
      // If JSON parsing fails, split by newlines and clean up
      bulletPoints = content
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^[-•*]\s*/, '').replace(/^"\s*|\s*"$/g, ''))
        .slice(0, 6)
    }

    return NextResponse.json({ bulletPoints })
  } catch (error) {
    console.error('Error generating bullet points:', error)
    return NextResponse.json(
      { error: 'Failed to generate bullet points' },
      { status: 500 }
    )
  }
}
