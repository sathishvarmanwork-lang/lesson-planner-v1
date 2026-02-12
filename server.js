// WHY: Backend proxy to call Claude API (fixes CORS and secures API key)
// WHAT: Express server with /api/generate endpoint

import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

// WHY: Allow frontend to call our backend
app.use(cors())
app.use(express.json())

// WHY: Proxy endpoint for Claude API calls
// WHAT: Receives lesson plan request, calls Claude, returns result
app.post('/api/generate', async (req, res) => {
  const { objective, grade, subject } = req.body

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

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    res.json({ lessonPlan: data.content[0].text })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Failed to generate lesson plan' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
})
