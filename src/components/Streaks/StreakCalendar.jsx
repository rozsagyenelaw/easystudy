import { useTheme } from '../../hooks/useTheme'

function getIntensity(minutes) {
  if (minutes === 0) return 0
  if (minutes < 10) return 1
  if (minutes < 20) return 2
  if (minutes < 40) return 3
  return 4
}

const INTENSITY_COLORS = {
  light: ['bg-stone-100', 'bg-emerald-100', 'bg-emerald-300', 'bg-emerald-500', 'bg-emerald-700'],
  dark: ['bg-slate-800', 'bg-emerald-900/40', 'bg-emerald-700/60', 'bg-emerald-600', 'bg-emerald-400'],
}

export default function StreakCalendar({ last30Days }) {
  const { isDark } = useTheme()
  const colors = isDark ? INTENSITY_COLORS.dark : INTENSITY_COLORS.light

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {last30Days.map((day) => {
          const intensity = getIntensity(day.minutesStudied)
          return (
            <div
              key={day.date}
              title={`${day.date}: ${day.minutesStudied}m, ${day.questionsAnswered}q`}
              className={`w-5 h-5 rounded-sm ${colors[intensity]} transition-colors cursor-default`}
            />
          )
        })}
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>Less</span>
        {colors.map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>More</span>
      </div>
    </div>
  )
}
