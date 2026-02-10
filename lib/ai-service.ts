// AI service using the custom endpoint configuration
const AI_ENDPOINT = 'https://llm.blackbox.ai/chat/completions';
const CUSTOMER_ID = 'cus_TiS2BshC1sXuLc';
const MODEL = 'openrouter/claude-sonnet-4';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function callAI(messages: AIMessage[]): Promise<string> {
  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'customerId': CUSTOMER_ID,
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: MODEL,
        messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data: AIResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI service error:', error);
    throw error;
  }
}

export async function generateProfessionalSummary(
  jobDescription: string,
  role: string,
  experience: string,
  skills: string[]
): Promise<string> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are an expert resume writer specializing in ATS-friendly resumes. Generate concise, impactful professional summaries that are 2-4 sentences long. Focus on matching the candidate's experience and skills to the target role. Use strong action words and quantifiable achievements when possible. Keep it professional and truthful based on the provided information.`
    },
    {
      role: 'user',
      content: `Generate a professional summary for a resume based on the following information:

Target Role: ${role}
Job Description: ${jobDescription}
Candidate's Experience: ${experience}
Key Skills: ${skills.join(', ')}

Create a 2-4 sentence professional summary that highlights relevant experience and skills for this role. Make it ATS-friendly and impactful.`
    }
  ];

  return await callAI(messages);
}

export async function extractKeywords(jobDescription: string): Promise<string[]> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are an ATS optimization expert. Extract key skills, technologies, and qualifications from job descriptions. Return ONLY a comma-separated list of keywords, no explanations or additional text.`
    },
    {
      role: 'user',
      content: `Extract the most important keywords, skills, and qualifications from this job description for ATS optimization:

${jobDescription}

Return only a comma-separated list of keywords.`
    }
  ];

  const result = await callAI(messages);
  return result.split(',').map(k => k.trim()).filter(k => k.length > 0);
}

export async function generateBulletPoints(
  jobDescription: string,
  experienceDescription: string,
  jobTitle: string,
  company: string
): Promise<string[]> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are an expert resume writer. Convert experience descriptions into 3-6 strong, ATS-friendly bullet points. Each bullet should:
- Start with a strong action verb
- Be 70-180 characters long
- Highlight achievements and impact
- Include metrics when the original description suggests them (but don't invent fake numbers)
- Match keywords from the job description when relevant
- Not end with a period
- Be truthful to the original experience

Return ONLY the bullet points, one per line, starting with a dash (-).`
    },
    {
      role: 'user',
      content: `Job Title: ${jobTitle}
Company: ${company}
Target Job Description: ${jobDescription}

Experience Description:
${experienceDescription}

Generate 3-6 impactful bullet points based on this experience that align with the target role.`
    }
  ];

  const result = await callAI(messages);
  return result
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => line.substring(1).trim())
    .filter(line => line.length > 0);
}

export async function generateProjectBullets(
  projectDescription: string,
  projectTitle: string,
  technologies: string[]
): Promise<string[]> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are an expert resume writer. Convert project descriptions into 2-4 concise, impactful bullet points. Each bullet should:
- Emphasize outcomes and impact
- Be clear and specific
- Highlight technical achievements
- Be 70-180 characters long
- Not end with a period

Return ONLY the bullet points, one per line, starting with a dash (-).`
    },
    {
      role: 'user',
      content: `Project: ${projectTitle}
Technologies: ${technologies.join(', ')}

Description:
${projectDescription}

Generate 2-4 impactful bullet points that highlight the outcomes and technical achievements of this project.`
    }
  ];

  const result = await callAI(messages);
  return result
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => line.substring(1).trim())
    .filter(line => line.length > 0);
}
