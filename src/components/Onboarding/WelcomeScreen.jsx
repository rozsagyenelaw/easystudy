import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

export default function WelcomeScreen({ onNext }) {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center text-center px-6 py-12 min-h-[60vh]"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-7xl mb-6"
      >
        📖
      </motion.div>

      <h1 className={`font-heading font-bold text-3xl mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
        {t('onboarding.welcome')}
      </h1>

      <p className={`text-base max-w-sm mb-2 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
        {t('app.tagline')}
      </p>

      <p className={`text-sm max-w-xs mb-10 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
        {t('onboarding.welcomeMsg')}
      </p>

      <button onClick={onNext} className="btn-primary text-lg px-10 py-4">
        {t('onboarding.getStarted')}
      </button>
    </motion.div>
  )
}
