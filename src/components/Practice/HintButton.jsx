import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

export default function HintButton({ hints = [], revealedCount = 0, onReveal }) {
  const { isDark } = useTheme()
  const hasMore = revealedCount < hints.length

  return (
    <div className="space-y-2">
      {/* Revealed hints */}
      <AnimatePresence>
        {hints.slice(0, revealedCount).map((hint, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`rounded-xl p-3 text-sm ${
              isDark ? 'bg-amber-900/10 border border-amber-800/20 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-700'
            }`}
          >
            <span className="font-heading font-medium">Hint {i + 1}: </span>
            {hint}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Show hint button */}
      {hasMore && (
        <button
          type="button"
          onClick={onReveal}
          className={`text-sm font-heading font-medium px-3 py-1.5 rounded-lg transition-colors ${
            isDark ? 'text-amber-400 hover:bg-amber-900/10' : 'text-amber-600 hover:bg-amber-50'
          }`}
        >
          💡 Show hint ({revealedCount}/{hints.length})
        </button>
      )}
    </div>
  )
}
