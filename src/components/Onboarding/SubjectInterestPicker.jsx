import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

const SUBJECTS = [
  { id: 'math', icon: '🔢', label: 'Math' },
  { id: 'physics', icon: '⚛️', label: 'Physics' },
  { id: 'chemistry', icon: '🧪', label: 'Chemistry' },
  { id: 'biology', icon: '🧬', label: 'Biology' },
  { id: 'history', icon: '📜', label: 'History' },
  { id: 'literature', icon: '📖', label: 'Literature' },
  { id: 'geography', icon: '🌍', label: 'Geography' },
  { id: 'economics', icon: '📈', label: 'Economics' },
]

export default function SubjectInterestPicker({ value = [], onChange, onNext, onBack }) {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter(s => s !== id))
    } else {
      onChange([...value, id])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-6 py-12"
    >
      <h2 className={`font-heading font-bold text-2xl mb-8 text-center ${isDark ? 'text-white' : 'text-navy'}`}>
        {t('onboarding.subjects')}
      </h2>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-10">
        {SUBJECTS.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => toggle(id)}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              value.includes(id)
                ? 'border-accent bg-accent/10'
                : isDark
                ? 'border-slate-700 bg-navy-light hover:border-slate-600'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <span className="text-xl">{icon}</span>
            <span className={`font-heading font-medium text-sm ${isDark ? 'text-white' : 'text-navy'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-between max-w-sm mx-auto">
        <button
          onClick={onBack}
          className={`px-6 py-2.5 rounded-xl font-heading font-medium text-sm ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-stone-500 hover:text-navy'
          }`}
        >
          {t('onboarding.back')}
        </button>
        <button
          onClick={onNext}
          disabled={value.length === 0}
          className="btn-primary px-6 py-2.5 disabled:opacity-40"
        >
          {t('onboarding.next')}
        </button>
      </div>
    </motion.div>
  )
}
