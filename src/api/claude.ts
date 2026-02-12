// WHY: Separate API logic from UI component for cleaner code
// WHAT: Handles Claude API calls for lesson plan generation

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export async function generateLessonPlan(
  objective: string,
  grade: string,
  subject: string
): Promise<string> {
  // WHY: We construct a detailed prompt to get structured lesson plans
  // WHAT: Combines user inputs into educational context for Claude
  const prompt = `You are an expert STEM educator designing lessons for Kuwait schools.

Generate a detailed 45-minute lesson plan with the following details:

Learning Objective: ${objective}
Grade Level: ${grade}
Subject: ${subject}

Provide a complete lesson plan including:
1. Learning Objectives (aligned with Kuwait curriculum standards)
2. Materials Needed
3. Lesson Structure:
   - Introduction (5 minutes)
   - Main Activity (30 minutes)
   - Conclusion (10 minutes)
4. Differentiation Strategies (for 3 ability levels)
5. Formative Assessment Method

Format the output clearly with section headings.`

  // WHY: Using fetch instead of SDK to avoid Replit compatibility issues
  // WHAT: Direct API call to Claude
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.content[0].text
}
