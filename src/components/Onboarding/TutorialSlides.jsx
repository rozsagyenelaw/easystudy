import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import { Link } from 'react-router-dom'

const SLIDES = [
  { icon: '✨', textKey: 'tutorialAsk' },
  { icon: '👣', textKey: 'tutorialSteps' },
  { icon: '🎯', textKey: 'tutorialPractice' },
]

export default function TutorialSlides({ onComplete, onBack }) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const [slide, setSlide] = useState(0)

  const isLast = slide === SLIDES.length - 1

  const handleNext = () => {
    if (isLast) {
      onComplete()
    } else {
      setSlide(s => s + 1)
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
        {t('onboarding.tutorial')}
      </h2>

      <div className="max-w-sm mx-auto mb-10 min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">{SLIDES[slide].icon}</div>
            <p className={`text-lg font-heading font-medium ${isDark ? 'text-white' : 'text-navy'}`}>
              {t(`onboarding.${SLIDES[slide].textKey}`)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === slide ? 'bg-accent' : isDark ? 'bg-slate-600' : 'bg-stone-300'
            }`}
          />
        ))}
      </div>

      {/* Account prompt on last slide */}
      {isLast && (
        <div className="text-center mb-6">
          <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            {t('onboarding.accountPrompt')}
          </p>
          <Link to="/login" className="text-accent text-sm font-heading font-medium">
            {t('settings.signIn')}
          </Link>
          <span className={`mx-2 text-xs ${isDark ? 'text-slate-600' : 'text-stone-300'}`}>|</span>
          <button
            onClick={onComplete}
            className={`text-sm font-heading font-medium ${isDark ? 'text-slate-500' : 'text-stone-400'}`}
          >
            {t('onboarding.skipForNow')}
          </button>
        </div>
      )}

      <div className="flex justify-between max-w-sm mx-auto">
        <button
          onClick={slide === 0 ? onBack : () => setSlide(s => s - 1)}
          className={`px-6 py-2.5 rounded-xl font-heading font-medium text-sm ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-stone-500 hover:text-navy'
          }`}
        >
          {t('onboarding.back')}
        </button>
        <button onClick={handleNext} className="btn-primary px-6 py-2.5">
          {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
        </button>
      </div>
    </motion.div>
  )
}
