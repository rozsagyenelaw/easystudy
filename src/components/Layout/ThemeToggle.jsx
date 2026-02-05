import { useTheme } from '../../hooks/useTheme'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
      style={{ backgroundColor: isDark ? '#334155' : '#e2e8f0' }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={isDark}
    >
      <motion.div
        className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs"
        style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff' }}
        animate={{ left: isDark ? '1.75rem' : '0.125rem' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </button>
  )
}
