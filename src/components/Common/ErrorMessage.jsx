import { useTheme } from '../../hooks/useTheme'

export default function ErrorMessage({ message, onRetry }) {
  const { isDark } = useTheme()

  return (
    <div
      className={`rounded-2xl p-6 text-center ${
        isDark ? 'bg-red-900/20 border border-red-800/30' : 'bg-red-50 border border-red-200'
      }`}
      role="alert"
    >
      <div className="text-3xl mb-3">:(</div>
      <p className={`font-heading font-medium mb-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
        Something went wrong
      </p>
      <p className={`text-sm mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-sm px-5 py-2">
          Try again
        </button>
      )}
    </div>
  )
}
