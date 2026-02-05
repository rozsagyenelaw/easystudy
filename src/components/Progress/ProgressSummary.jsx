import { useTheme } from '../../hooks/useTheme'

export default function ProgressSummary({ stats, streakData }) {
  const { isDark } = useTheme()

  const cards = [
    { label: 'Questions Solved', value: stats.totalQuestions, icon: '📝' },
    { label: 'Subjects Studied', value: stats.subjectsStudied, icon: '📚' },
    { label: 'Accuracy', value: `${stats.averageAccuracy}%`, icon: '🎯' },
    { label: 'Current Streak', value: `${streakData?.currentStreak || 0}d`, icon: '🔥' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(({ label, value, icon }) => (
        <div
          key={label}
          className={`rounded-2xl p-4 text-center border ${
            isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'
          }`}
        >
          <div className="text-2xl mb-1">{icon}</div>
          <p className={`font-heading font-bold text-xl ${isDark ? 'text-white' : 'text-navy'}`}>
            {value}
          </p>
          <p className={`text-xs font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}
