import { useTheme } from '../../hooks/useTheme'

export default function TheorySummary({ theory }) {
  const { isDark } = useTheme()

  if (!theory) return null

  // Split by double newlines for paragraphs
  const paragraphs = theory.split('\n\n')

  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}
        >
          {p}
        </p>
      ))}
    </div>
  )
}
