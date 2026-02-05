import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

export default function StreakWidget({ currentStreak, streakAtRisk }) {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-2xl p-4 flex items-center gap-3 border ${
        streakAtRisk
          ? isDark
            ? 'bg-amber-900/10 border-amber-800/30'
            : 'bg-amber-50 border-amber-200'
          : isDark
          ? 'bg-navy-light border-slate-700'
          : 'bg-white border-stone-200'
      }`}
    >
      <span className="text-3xl">🔥</span>
      <div className="flex-1">
        <p className={`font-heading font-bold text-lg ${isDark ? 'text-white' : 'text-navy'}`}>
          {currentStreak} day streak{currentStreak !== 1 ? '' : ''}!
        </p>
        <p className={`text-xs ${
          streakAtRisk
            ? isDark ? 'text-amber-400' : 'text-amber-600'
            : isDark ? 'text-slate-400' : 'text-stone-500'
        }`}>
          {streakAtRisk
            ? "Don't lose your streak! Study today."
            : currentStreak > 0
            ? 'Keep it going!'
            : 'Start studying to build your streak.'}
        </p>
      </div>
      {streakAtRisk && (
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-xl"
        >
          ⚠️
        </motion.span>
      )}
    </motion.div>
  )
}
