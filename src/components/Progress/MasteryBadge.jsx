import { useTheme } from '../../hooks/useTheme'

const LEVELS = {
  beginner: { label: 'Beginner', color: 'slate', icon: '🌱', bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-300' },
  improving: { label: 'Improving', color: 'amber', icon: '📈', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  confident: { label: 'Confident', color: 'blue', icon: '💪', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  mastered: { label: 'Mastered', color: 'emerald', icon: '⭐', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
}

export default function MasteryBadge({ level, size = 'sm' }) {
  const config = LEVELS[level] || LEVELS.beginner

  const sizeClasses = size === 'lg'
    ? 'px-3 py-1.5 text-sm'
    : 'px-2 py-0.5 text-xs'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-heading font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}
