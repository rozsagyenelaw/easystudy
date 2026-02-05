import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

const GOALS = [
  { key: 'passExams', icon: '✅' },
  { key: 'improveGrades', icon: '📈' },
  { key: 'learnNew', icon: '🌟' },
  { key: 'prepareTest', icon: '📝' },
]

export default function GoalPicker({ value, onChange, onNext, onBack }) {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-6 py-12"
    >
      <h2 className={`font-heading font-bold text-2xl mb-8 text-center ${isDark ? 'text-white' : 'text-navy'}`}>
        {t('onboarding.goal')}
      </h2>

      <div className="space-y-3 max-w-sm mx-auto mb-10">
        {GOALS.map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
              value === key
                ? 'border-accent bg-accent/10'
                : isDark
                ? 'border-slate-700 bg-navy-light hover:border-slate-600'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <span className="text-2xl">{icon}</span>
            <span className={`font-heading font-medium ${isDark ? 'text-white' : 'text-navy'}`}>
              {t(`onboarding.${key}`)}
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
          disabled={!value}
          className="btn-primary px-6 py-2.5 disabled:opacity-40"
        >
          {t('onboarding.next')}
        </button>
      </div>
    </motion.div>
  )
}
