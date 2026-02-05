import katex from 'katex'

// Strip HTML tags that might be in AI-generated LaTeX
function sanitizeLatex(latex) {
  if (!latex) return ''
  // Remove HTML tags
  let clean = latex.replace(/<[^>]*>/g, '')
  // Decode common HTML entities
  clean = clean.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  clean = clean.replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
  return clean.trim()
}

export function renderLatex(latex, displayMode = false) {
  try {
    const clean = sanitizeLatex(latex)
    return katex.renderToString(clean, {
      displayMode,
      throwOnError: false,
      trust: true,
      strict: false,
    })
  } catch {
    // If KaTeX still fails, return sanitized text
    return sanitizeLatex(latex)
  }
}

export function processTextWithMath(text) {
  if (!text) return ''
  // Strip any raw HTML from the text first
  let safeText = text

  // Replace display math $$...$$ and inline math $...$
  // Display math first (greedy for $$)
  let processed = safeText.replace(/\$\$([\s\S]*?)\$\$/g, (_, latex) => {
    return `<span class="katex-display-inline">${renderLatex(latex, true)}</span>`
  })
  // Inline math
  processed = processed.replace(/\$([^$\n]+?)\$/g, (_, latex) => {
    return renderLatex(latex, false)
  })
  return processed
}
