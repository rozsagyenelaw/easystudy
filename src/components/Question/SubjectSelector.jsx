import { SUBJECTS } from '../../utils/subjectDetector'
import { useTheme } from '../../hooks/useTheme'

export default function SubjectSelector({ selected, onSelect }) {
  const { isDark } = useTheme()

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select subject">
      {SUBJECTS.map((subject) => {
        const isActive = selected === subject
        return (
          <button
            key={subject}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(subject)}
            className={`px-4 py-2 rounded-full text-sm font-heading font-medium transition-all duration-200 cursor-pointer select-none ${
              isActive
                ? 'bg-accent text-white shadow-md shadow-accent/20'
                : isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {subject}
          </button>
        )
      })}
    </div>
  )
}
