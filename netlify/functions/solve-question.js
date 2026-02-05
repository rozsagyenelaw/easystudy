// Rate limiting store (in-memory, resets per function instance)
const rateLimits = new Map()
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

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

const SYSTEM_PROMPT = `You are an expert tutor helping students understand academic topics step by step. You MUST return valid JSON (no markdown code fences, no extra text — only the JSON object).

Return this exact JSON structure:
{
  "subject_detected": "the subject area",
  "topic": "specific topic within subject",
  "steps": [
    {
      "step_number": 1,
      "title": "Short title of this step",
      "explanation": "Clear, thorough explanation. Use $...$ for inline LaTeX and $$...$$ for display LaTeX.",
      "formula": "LaTeX formula if applicable, or null",
      "intermediate_result": "Result after this step, or null"
    }
  ],
  "final_answer": "The complete answer, clearly stated",
  "alternative_method": {
    "name": "Method name",
    "brief_description": "When/why to use this method",
    "steps": [same format as above]
  },
  "key_concepts": ["concept1", "concept2"],
  "difficulty": "easy|medium|hard"
}

Rules:
- Set "alternative_method" to null if no meaningful alternative exists.
- Use LaTeX notation for all mathematical expressions.
- Explanations should be clear enough for a student learning the topic for the first time.
- Each step should build logically on the previous one.
- The number of steps should match the complexity of the problem.`

const DEPTH_INSTRUCTIONS = {
  basic: 'Give a concise explanation with fewer steps. Focus on the key idea and final answer.',
  standard: 'Give a thorough explanation with clear steps. Balance detail and brevity.',
  deep: 'Give a very detailed explanation. Include background concepts, why each step works, common mistakes, and connections to related topics.',
}

const FOLLOW_UP_SYSTEM = `You are an expert tutor. A student wants a deeper explanation of a specific step in a solution. Explain it more thoroughly with additional detail, sub-steps, and intuition. Return valid JSON (no markdown fences):
{
  "detailed_explanation": "A much more detailed explanation of this step",
  "sub_steps": [
    {
      "title": "Sub-step title",
      "explanation": "Detailed explanation"
    }
  ],
  "common_mistakes": ["mistake1", "mistake2"],
  "intuition": "Why this step works — the underlying intuition"
}`

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

  const { question, subject, depth = 'standard', followUpStepIndex } = body

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return Response.json({ error: 'Question is required' }, { status: 400 })
  }

  const isFollowUp = followUpStepIndex !== undefined && followUpStepIndex !== null

  const systemPrompt = isFollowUp ? FOLLOW_UP_SYSTEM : SYSTEM_PROMPT
  const depthNote = DEPTH_INSTRUCTIONS[depth] || DEPTH_INSTRUCTIONS.standard

  let userMessage
  if (isFollowUp) {
    userMessage = `The original question was: "${question}"\n\nPlease explain step ${followUpStepIndex + 1} in much more detail.`
  } else {
    userMessage = `Subject: ${subject || 'Auto-detect'}\nDepth: ${depthNote}\n\nQuestion: ${question}`
  }

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
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return Response.json(
        { error: 'Failed to generate solution. Please try again.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const text = data.content?.[0]?.text

    if (!text) {
      return Response.json(
        { error: 'Empty response from AI. Try rephrasing your question.' },
        { status: 502 }
      )
    }

    // Parse the JSON response from Claude
    let parsed
    try {
      // Strip potential markdown code fences
      const cleaned = text.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      return Response.json(
        { error: 'Could not parse AI response. Try rephrasing your question.' },
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
  path: '/.netlify/functions/solve-question',
}
