// WHY: Call our backend API (Replit-compatible URL)
// WHAT: Dynamically construct backend URL based on current host

export async function generateLessonPlan(
  objective: string,
  grade: string,
  subject: string
): Promise<string> {
  // WHY: In Replit, use same host but port 3000 for backend
  // WHAT: Construct URL like https://xxx.replit.dev:3000
  const backendUrl = window.location.hostname.includes('replit')
    ? `https://${window.location.hostname.replace(/\.replit\.dev.*/, '.replit.dev')}:3000/api/generate`
    : 'http://localhost:3000/api/generate'

  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      objective,
      grade,
      subject,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate lesson plan')
  }

  const data = await response.json()
  return data.lessonPlan
}
