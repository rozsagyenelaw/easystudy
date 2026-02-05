import { useTheme } from '../../hooks/useTheme'

export default function StudyPlanCard({ day, dayIndex, onToggleTask }) {
  const { isDark } = useTheme()

  const isToday = day.date === new Date().toISOString().split('T')[0]
  const isPast = day.date < new Date().toISOString().split('T')[0]
  const allCompleted = day.activities?.every(a => typeof a === 'object' && a.completed)

  return (
    <div
      className={`rounded-2xl p-4 border ${
        isToday
          ? isDark
            ? 'bg-accent/10 border-accent/30'
            : 'bg-blue-50 border-accent/20'
          : isDark
          ? 'bg-navy-light border-slate-700'
          : 'bg-white border-stone-200'
      } ${allCompleted ? 'opacity-70' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-heading font-bold uppercase tracking-wider ${
            isToday
              ? 'text-accent'
              : isDark ? 'text-slate-400' : 'text-stone-500'
          }`}>
            {isToday ? 'Today' : new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          {allCompleted && <span className="text-emerald text-xs">✓ Done</span>}
        </div>
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
          ~{day.estimatedMinutes || 20} min
        </span>
      </div>

      {/* Topics */}
      {day.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {day.topics.map((topic, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-medium ${
                isDark ? 'bg-slate-700 text-slate-300' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Activities */}
      <div className="space-y-1.5">
        {(day.activities || []).map((activity, i) => {
          const text = typeof activity === 'string' ? activity : activity.text
          const completed = typeof activity === 'object' && activity.completed

          return (
            <label key={i} className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={completed}
                onChange={() => onToggleTask(dayIndex, i)}
                className="mt-0.5 rounded accent-accent"
              />
              <span className={`text-sm ${
                completed
                  ? 'line-through ' + (isDark ? 'text-slate-500' : 'text-stone-400')
                  : isDark ? 'text-slate-200' : 'text-stone-700'
              }`}>
                {text}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
