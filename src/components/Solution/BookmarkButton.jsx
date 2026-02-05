import { useTheme } from '../../hooks/useTheme'

export default function BookmarkButton({ bookmarked, onToggle }) {
  const { isDark } = useTheme()

  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-medium transition-all duration-200 ${
        bookmarked
          ? 'bg-amber-400/20 text-amber-400'
          : isDark
          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
      }`}
      aria-label={bookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}
    >
      {bookmarked ? '★ Saved' : '☆ Save'}
    </button>
  )
}
