import { useTheme } from '../../hooks/useTheme'
import { Link } from 'react-router-dom'

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald/20 text-emerald',
  medium: 'bg-amber-500/20 text-amber-500',
  hard: 'bg-red-500/20 text-red-400',
}

export default function QuestionCard({ item, onDelete, onToggleBookmark }) {
  const { isDark } = useTheme()

  const timeAgo = (timestamp) => {
    if (!timestamp) return ''
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp.toDate?.() || new Date(timestamp)
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div
      className={`rounded-2xl p-4 border transition-all duration-200 hover:shadow-md ${
        isDark
          ? 'bg-navy-light border-slate-700 hover:border-slate-600'
          : 'bg-white border-stone-200 hover:border-stone-300'
      }`}
    >
      <Link to={`/solution/${item.id}`} className="block">
        <p className={`font-body text-sm line-clamp-2 mb-3 ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
          {item.question}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-heading font-medium ${
            isDark ? 'bg-accent/20 text-accent' : 'bg-blue-50 text-accent'
          }`}>
            {item.subject}
          </span>
          {item.difficulty && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-heading font-medium ${DIFFICULTY_COLORS[item.difficulty] || DIFFICULTY_COLORS.medium}`}>
              {item.difficulty}
            </span>
          )}
          <span className={`text-xs ml-auto ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
            {timeAgo(item.timestamp)}
          </span>
        </div>
      </Link>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/30 dark:border-slate-700/30">
        {onToggleBookmark && (
          <button
            onClick={() => onToggleBookmark(item.id)}
            className={`text-sm px-2 py-1 rounded-lg transition-colors ${
              item.bookmarked
                ? 'text-amber-400'
                : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-stone-400 hover:text-stone-600'
            }`}
            aria-label={item.bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {item.bookmarked ? '★' : '☆'}
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className={`text-sm px-2 py-1 rounded-lg transition-colors ml-auto ${
              isDark ? 'text-slate-500 hover:text-red-400' : 'text-stone-400 hover:text-red-500'
            }`}
            aria-label="Delete question"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  )
}
