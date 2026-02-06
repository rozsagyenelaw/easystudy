const API_BASE = '/.netlify/functions'

export async function solveQuestion({ question, subject, depth = 'standard', followUpStepIndex, mode = 'full' }) {
  const response = await fetch(`${API_BASE}/solve-question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, subject, depth, followUpStepIndex, mode }),
  })

  if (response.status === 429) {
    const data = await response.json()
    throw new Error(data.error || 'Rate limit exceeded. Try again later.')
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to get a solution. Try rephrasing your question.')
  }

  return response.json()
}
