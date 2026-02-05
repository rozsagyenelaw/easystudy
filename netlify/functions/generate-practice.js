const rateLimits = new Map()
const RATE_LIMIT = 15
const RATE_WINDOW_MS = 60 * 60 * 1000

function getRateLimitKey(event) {
  const uid = event.headers['x-firebase-uid']
  if (uid) return `practice:uid:${uid}`
  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    event.headers['client-ip'] || 'unknown'
  return `practice:ip:${ip}`
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

const SYSTEM_PROMPT = `You are an expert tutor generating practice questions for students. Return ONLY valid JSON (no markdown fences).

Generate practice questions in this exact format:
{
  "questions": [
    {
      "id": "unique-id-string",
      "question_text": "The practice question",
      "subject": "Math",
      "topic": "the specific topic",
      "difficulty": "easy|medium|hard",
      "hints": ["hint 1 (gentle nudge)", "hint 2 (more specific)", "hint 3 (almost gives it away)"],
      "solution": {
        "steps": [
          {
            "step_number": 1,
            "title": "Step title",
            "explanation": "Clear explanation. Use $...$ for inline LaTeX and $$...$$ for display LaTeX.",
            "formula": "LaTeX formula if applicable, or null",
            "intermediate_result": "Result after this step, or null"
          }
        ],
        "final_answer": "The complete answer"
      }
    }
  ]
}

Rules:
- Generate exactly the requested number of questions
- Questions should be appropriate for the specified difficulty
- Hints should progressively give more information
- Each question should be unique and test different aspects of the topic
- Use LaTeX for all math expressions
- Solutions should be clear and educational`

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

  const { subject, topic, difficulty = 'medium', count = 5 } = body
  const clampedCount = Math.min(Math.max(parseInt(count) || 5, 1), 15)

  if (!subject) {
    return Response.json({ error: 'Subject is required' }, { status: 400 })
  }

  const userMessage = `Generate ${clampedCount} practice questions.
Subject: ${subject}
Topic: ${topic || 'General ' + subject}
Difficulty: ${difficulty}

Make sure each question is different and tests a distinct concept or skill within the topic.`

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
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to generate practice questions. Try again.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const text = data.content?.[0]?.text

    if (!text) {
      return Response.json({ error: 'Empty response from AI.' }, { status: 502 })
    }

    let parsed
    try {
      const cleaned = text.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      return Response.json({ error: 'Could not parse AI response.' }, { status: 502 })
    }

    return Response.json(parsed)
  } catch (err) {
    console.error('Practice generation error:', err)
    return Response.json({ error: 'Network error. Please try again.' }, { status: 500 })
  }
}

export const config = {
  path: '/.netlify/functions/generate-practice',
}
