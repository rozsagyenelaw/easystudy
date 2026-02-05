import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

export default function AchievementsList({ earned, allAchievements }) {
  const { isDark } = useTheme()

  const earnedIds = new Set(earned.map(a => a.id))

  return (
    <div className="grid grid-cols-2 gap-3">
      {allAchievements.map((def) => {
        const isEarned = earnedIds.has(def.id)
        const earnedData = earned.find(a => a.id === def.id)

        return (
          <motion.div
            key={def.id}
            initial={false}
            animate={{ opacity: isEarned ? 1 : 0.4 }}
            className={`rounded-2xl p-4 text-center border ${
              isEarned
                ? isDark
                  ? 'bg-accent/10 border-accent/30'
                  : 'bg-blue-50 border-accent/20'
                : isDark
                ? 'bg-navy-light border-slate-700'
                : 'bg-white border-stone-200'
            }`}
          >
            <div className="text-2xl mb-1">{def.icon}</div>
            <p className={`font-heading font-semibold text-xs ${isDark ? 'text-white' : 'text-navy'}`}>
              {def.title}
            </p>
            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              {def.desc}
            </p>
            {isEarned && earnedData?.earnedAt && (
              <p className="text-[10px] text-accent mt-1">
                {new Date(earnedData.earnedAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
