// Spaced repetition interval calculator
// Uses a simplified SM-2 algorithm

function calculateNextReview(item, quality) {
  // quality: 0 = wrong, 1 = hesitant, 2 = confident, 3 = easy
  const qualityMap = { wrong: 0, hesitant: 1, confident: 2, easy: 3 }
  const q = typeof quality === 'string' ? (qualityMap[quality] ?? 0) : quality

  let interval
  let easeFactor = item.easeFactor || 2.5

  if (q < 2) {
    // Failed — reset interval
    interval = 1
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else {
    const repetition = (item.repetition || 0) + 1

    if (repetition === 1) {
      interval = 1
    } else if (repetition === 2) {
      interval = 3
    } else {
      interval = Math.round((item.lastInterval || 3) * easeFactor)
    }

    easeFactor = Math.max(1.3, easeFactor + (0.1 - (3 - q) * (0.08 + (3 - q) * 0.02)))

    return {
      interval: Math.min(interval, 30),
      easeFactor,
      repetition,
      nextReviewDate: getDatePlusDays(interval),
    }
  }

  return {
    interval,
    easeFactor,
    repetition: 0,
    nextReviewDate: getDatePlusDays(interval),
  }
}

function getDatePlusDays(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const JSON_HEADERS = {
  ...CORS_HEADERS,
  'Content-Type': 'application/json',
}

function jsonResponse(statusCode, data) {
  return { statusCode, headers: JSON_HEADERS, body: JSON.stringify(data) }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' })
  }

  const { items } = body

  if (!items || !Array.isArray(items)) {
    return jsonResponse(400, { error: 'Items array is required' })
  }

  const results = items.map(item => {
    const result = calculateNextReview(item, item.quality)
    return {
      id: item.id,
      ...result,
    }
  })

  return jsonResponse(200, { results })
}
