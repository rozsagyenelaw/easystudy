import katex from 'katex'

export function renderLatex(latex, displayMode = false) {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      trust: true,
      strict: false,
    })
  } catch {
    return latex
  }
}

export function processTextWithMath(text) {
  if (!text) return ''
  // Replace display math $$...$$ and inline math $...$
  // Display math first (greedy for $$)
  let processed = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, latex) => {
    return `<span class="katex-display-inline">${renderLatex(latex.trim(), true)}</span>`
  })
  // Inline math
  processed = processed.replace(/\$([^$\n]+?)\$/g, (_, latex) => {
    return renderLatex(latex.trim(), false)
  })
  return processed
}
