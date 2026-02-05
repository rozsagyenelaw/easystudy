import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

export default function AchievementToast({ achievement, onDismiss }) {
  const { isDark } = useTheme()

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60]"
          onClick={onDismiss}
        >
          <div className={`rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg border ${
            isDark
              ? 'bg-navy-light border-accent/30'
              : 'bg-white border-accent/20'
          }`}>
            <span className="text-2xl">{achievement.icon}</span>
            <div>
              <p className={`font-heading font-semibold text-sm ${isDark ? 'text-white' : 'text-navy'}`}>
                Achievement Unlocked!
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                {achievement.title}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
