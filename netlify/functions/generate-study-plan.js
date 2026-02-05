const rateLimits = new Map()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 60 * 1000

function getRateLimitKey(event) {
  const uid = event.headers['x-firebase-uid']
  if (uid) return `uid:${uid}`
  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    event.headers['client-ip'] || 'unknown'
  return `ip:${ip}`
}

function checkRateLimit(key) {
  const now = Date.now()
  const record = rateLimits.get(key) || { count: 0, windowStart: now }

  if (now - record.windowStart > RATE_WINDOW_MS) {
    record.count = 0
    record.windowStart = now
  }

  record.count++
  rateLimits.set(key, record)

  if (record.count > RATE_LIMIT) {
    const remaining = Math.ceil((record.windowStart + RATE_WINDOW_MS - now) / 60000)
    return { allowed: false, remaining }
  }

  return { allowed: true }
}

const SYSTEM_PROMPT = `You are an expert academic study planner. Create a personalized day-by-day study plan. You MUST return valid JSON only (no markdown code fences, no extra text).

Return this exact JSON structure:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "topics": ["Topic 1", "Topic 2"],
      "activities": ["Review theory on Topic 1", "Practice 5 medium questions on Topic 2", "Review notes"],
      "estimatedMinutes": 25
    }
  ]
}

Rules:
- Start from tomorrow's date
- Each day's estimated minutes should be close to the requested daily minutes
- Distribute topics progressively: start with fundamentals, build complexity
- Include variety: theory review, practice questions, problem solving
- If an exam date is provided, ensure all topics are covered before the exam
- Plan for 5-14 days depending on the goal scope
- Activities should be specific and actionable
- Include review days for previously covered topics (spaced repetition)
- Each day should have 2-4 activities`

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-Firebase-UID',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const rateLimitKey = getRateLimitKey({ headers: Object.fromEntries(req.headers) })
  const { allowed, remaining } = checkRateLimit(rateLimitKey)

  if (!allowed) {
    return Response.json(
      { error: `Rate limit exceeded. Try again in ${remaining} minutes.` },
      { status: 429 }
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { goal, subjects, currentProgress, examDate, dailyMinutes = 20 } = body

  if (!goal || !subjects?.length) {
    return Response.json({ error: 'Goal and subjects are required' }, { status: 400 })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const startDate = tomorrow.toISOString().split('T')[0]

  let progressSummary = 'No prior progress data.'
  if (currentProgress && Object.keys(currentProgress).length > 0) {
    const lines = []
    for (const [subject, data] of Object.entries(currentProgress)) {
      lines.push(`${subject}: ${data.totalQuestions} questions, ${data.averageAccuracy}% accuracy`)
      for (const [topic, t] of Object.entries(data.topics || {})) {
        lines.push(`  - ${topic}: ${t.masteryLevel} (${t.questionsAttempted} questions)`)
      }
    }
    progressSummary = lines.join('\n')
  }

  const userMessage = `Create a study plan starting from ${startDate}.

Goal: ${goal}
Subjects: ${subjects.join(', ')}
Daily study time: ${dailyMinutes} minutes
${examDate ? `Exam date: ${examDate}` : 'No specific exam date.'}

Student's current progress:
${progressSummary}

Please create an optimized day-by-day study plan. Focus more time on weaker areas and include review sessions.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return Response.json(
        { error: 'Failed to generate study plan. Please try again.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const text = data.content?.[0]?.text

    if (!text) {
      return Response.json(
        { error: 'Empty response from AI. Please try again.' },
        { status: 502 }
      )
    }

    let parsed
    try {
      const cleaned = text.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      return Response.json(
        { error: 'Could not parse AI response. Please try again.' },
        { status: 502 }
      )
    }

    return Response.json(parsed)
  } catch (err) {
    console.error('Function error:', err)
    return Response.json(
      { error: 'Network error. Please check your connection and try again.' },
      { status: 500 }
    )
  }
}

export const config = {
  path: '/.netlify/functions/generate-study-plan',
}
