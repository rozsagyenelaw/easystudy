import { useTheme } from '../../hooks/useTheme'

export default function DailyGoalProgress({ minutesStudied, goalMinutes, questionsAnswered }) {
  const { isDark } = useTheme()
  const percent = Math.min(100, Math.round((minutesStudied / goalMinutes) * 100))
  const completed = percent >= 100

  return (
    <div className={`rounded-2xl p-4 border ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-heading font-medium ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
          Daily Goal
        </span>
        <span className={`text-xs font-heading font-medium ${
          completed ? 'text-emerald' : isDark ? 'text-slate-400' : 'text-stone-500'
        }`}>
          {completed ? 'Completed! ✓' : `${minutesStudied}/${goalMinutes} min`}
        </span>
      </div>
      <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            completed ? 'bg-emerald' : 'bg-accent'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
        {questionsAnswered} question{questionsAnswered !== 1 ? 's' : ''} today
      </p>
    </div>
  )
}
