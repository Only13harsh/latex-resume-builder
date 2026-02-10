import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { title, description, technologies, targetRole } = await request.json()

    const systemPrompt = `You are an expert resume writer specializing in creating impact-focused project bullet points for resumes.`

    const userPrompt = `Transform the following project description into 2-4 strong, impact-focused bullet points.

Project: ${title}
Technologies: ${technologies?.join(', ') || 'Not specified'}
Target Role: ${targetRole}

Project Description:
${description}

Guidelines for bullet points:
1. Start with strong action verbs (Built, Developed, Designed, Implemented, Created, etc.)
2. Highlight technical skills and technologies used
3. Emphasize outcomes, impact, or results achieved
4. Keep each bullet to 1-2 lines (70-180 characters)
5. Make it relevant to the target role
6. Focus on what YOU did, not the project itself
7. Do not end with periods

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
        .slice(0, 4)
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
