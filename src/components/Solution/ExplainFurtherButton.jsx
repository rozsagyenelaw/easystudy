import { useTheme } from '../../hooks/useTheme'

export default function ExplainFurtherButton({ loading, expanded, onClick }) {
  const { isDark } = useTheme()

  if (expanded) return null

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`text-xs font-heading font-medium px-3 py-1.5 rounded-lg transition-colors ${
        loading
          ? 'opacity-50 cursor-not-allowed'
          : isDark
          ? 'text-accent hover:bg-accent/10'
          : 'text-accent hover:bg-blue-50'
      }`}
      aria-label="Explain this step in more detail"
    >
      {loading ? 'Explaining...' : '🔍 Explain this step further'}
    </button>
  )
}
