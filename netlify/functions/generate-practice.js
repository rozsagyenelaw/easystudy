const rateLimits = new Map()
const RATE_LIMIT = 15
const RATE_WINDOW_MS = 60 * 60 * 1000

function getRateLimitKey(headers) {
  const uid = headers['x-firebase-uid']
  if (uid) return `practice:uid:${uid}`
  const ip = headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['client-ip'] || 'unknown'
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

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Firebase-UID',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const JSON_HEADERS = {
  ...CORS_HEADERS,
  'Content-Type': 'application/json',
}

function jsonResponse(statusCode, data) {
  return { statusCode, headers: JSON_HEADERS, body: JSON.stringify(data) }
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

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  const rateLimitKey = getRateLimitKey(event.headers)
  const { allowed, remaining } = checkRateLimit(rateLimitKey)
  if (!allowed) {
    return jsonResponse(429, { error: `Rate limit exceeded. Try again in ${remaining} minutes.` })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return jsonResponse(500, { error: 'API key not configured' })
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' })
  }

  const { subject, topic, difficulty = 'medium', count = 5 } = body
  const clampedCount = Math.min(Math.max(parseInt(count) || 5, 1), 15)

  if (!subject) {
    return jsonResponse(400, { error: 'Subject is required' })
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
        model: 'claude-opus-4-6',
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      return jsonResponse(502, { error: 'Failed to generate practice questions. Try again.' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text

    if (!text) {
      return jsonResponse(502, { error: 'Empty response from AI.' })
    }

    let parsed
    try {
      const cleaned = text.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      return jsonResponse(502, { error: 'Could not parse AI response.' })
    }

    return jsonResponse(200, parsed)
  } catch (err) {
    console.error('Practice generation error:', err)
    return jsonResponse(500, { error: 'Network error. Please try again.' })
  }
}
