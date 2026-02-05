import { useTheme } from '../../hooks/useTheme'
import MasteryBadge from './MasteryBadge'

const MASTERY_COLORS = {
  beginner: 'bg-slate-300 dark:bg-slate-600',
  improving: 'bg-amber-400 dark:bg-amber-500',
  confident: 'bg-blue-500 dark:bg-blue-400',
  mastered: 'bg-emerald-500 dark:bg-emerald-400',
}

const MASTERY_PERCENT = { beginner: 10, improving: 37, confident: 65, mastered: 90 }

export default function TopicMastery({ topics }) {
  const { isDark } = useTheme()

  if (!topics || Object.keys(topics).length === 0) {
    return (
      <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
        No topics tracked yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {Object.entries(topics).map(([topicName, data]) => {
        const level = data.masteryLevel || 'beginner'
        const percent = MASTERY_PERCENT[level] || 10
        const accuracy = data.questionsAttempted > 0
          ? Math.round((data.questionsCorrect / data.questionsAttempted) * 100)
          : 0

        return (
          <div key={topicName}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-heading font-medium ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
                {topicName}
              </span>
              <MasteryBadge level={level} />
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${MASTERY_COLORS[level]}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                {data.questionsAttempted} questions · {accuracy}% accuracy
              </span>
              {data.lastPracticed && (
                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                  Last: {new Date(data.lastPracticed).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
