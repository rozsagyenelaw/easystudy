import { useTheme } from '../../hooks/useTheme'

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'bg-emerald/20 text-emerald' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500/20 text-amber-500' },
  { value: 'hard', label: 'Hard', color: 'bg-red-500/20 text-red-400' },
]

export default function DifficultySelector({ selected, onSelect }) {
  const { isDark } = useTheme()

  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Select difficulty">
      {DIFFICULTIES.map(({ value, label, color }) => {
        const isActive = selected === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(value)}
            className={`px-4 py-2 rounded-full text-sm font-heading font-medium transition-all cursor-pointer ${
              isActive
                ? color + ' ring-2 ring-current/30'
                : isDark
                ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
