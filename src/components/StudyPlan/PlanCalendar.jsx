import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import StudyPlanCard from './StudyPlanCard'

export default function PlanCalendar({ plan, onToggleTask }) {
  const { isDark } = useTheme()
  const [view, setView] = useState('week')

  if (!plan?.generatedPlan?.length) {
    return (
      <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
        No study plan generated yet.
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const days = plan.generatedPlan

  // Filter by view
  const filteredDays = view === 'week'
    ? days.filter(d => {
        const diff = (new Date(d.date + 'T12:00:00') - new Date(today + 'T12:00:00')) / (24 * 60 * 60 * 1000)
        return diff >= -1 && diff <= 6
      })
    : days

  return (
    <div>
      {/* View toggle */}
      <div className="flex gap-2 mb-4">
        {['week', 'all'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-medium transition-colors ${
              view === v
                ? 'bg-accent text-white'
                : isDark
                ? 'bg-navy-lighter text-slate-400 hover:text-slate-200'
                : 'bg-stone-100 text-stone-500 hover:text-stone-700'
            }`}
          >
            {v === 'week' ? 'This week' : 'Full plan'}
          </button>
        ))}
      </div>

      {/* Plan progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className={isDark ? 'text-slate-400' : 'text-stone-500'}>
            Plan progress
          </span>
          <span className={isDark ? 'text-slate-400' : 'text-stone-500'}>
            {days.filter(d => d.completed).length}/{days.length} days
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`}>
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${(days.filter(d => d.completed).length / days.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Days */}
      <div className="space-y-3">
        {filteredDays.map((day, i) => {
          const originalIndex = days.indexOf(day)
          return (
            <StudyPlanCard
              key={day.date}
              day={day}
              dayIndex={originalIndex}
              onToggleTask={onToggleTask}
            />
          )
        })}
      </div>

      {filteredDays.length === 0 && (
        <p className={`text-center py-6 text-sm ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
          No tasks for this view.
        </p>
      )}
    </div>
  )
}
