import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useBookmarks } from '../hooks/useBookmarks'
import QuestionCard from '../components/Question/QuestionCard'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function Bookmarks() {
  const { isDark } = useTheme()
  const { bookmarks, loading, toggleBookmark, deleteQuestion } = useBookmarks()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      <h1 className={`font-heading font-bold text-2xl mb-6 ${isDark ? 'text-white' : 'text-navy'}`}>
        Saved Questions
      </h1>

      {loading && <LoadingSpinner message="Loading bookmarks..." />}

      {!loading && bookmarks.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔖</div>
          <p className={`font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            No saved questions
          </p>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
            Bookmark solutions you want to revisit later.
          </p>
          <Link to="/ask" className="btn-primary inline-block">
            Ask a question ✨
          </Link>
        </div>
      )}

      {!loading && bookmarks.length > 0 && (
        <div className="space-y-3">
          {bookmarks.map((item) => (
            <QuestionCard
              key={item.id}
              item={item}
              onDelete={deleteQuestion}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
