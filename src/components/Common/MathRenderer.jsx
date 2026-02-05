import { useMemo } from 'react'
import { processTextWithMath } from '../../utils/mathRendering'
import 'katex/dist/katex.min.css'

export default function MathRenderer({ text, className = '' }) {
  const html = useMemo(() => processTextWithMath(text || ''), [text])

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
