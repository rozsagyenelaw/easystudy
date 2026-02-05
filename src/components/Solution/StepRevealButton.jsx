import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

export default function StepRevealButton({ onReveal, stepsRemaining }) {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-3 py-4"
    >
      <p className={`text-sm font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
        💡 Want to try the next step yourself first?
      </p>
      <button
        onClick={onReveal}
        className="btn-secondary text-sm"
        aria-label={`Show next step (${stepsRemaining} remaining)`}
      >
        Show next step ({stepsRemaining} remaining)
      </button>
    </motion.div>
  )
}
