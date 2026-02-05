import { motion, AnimatePresence } from 'framer-motion'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import { useTheme } from '../../hooks/useTheme'

export default function InstallBanner() {
  const { showBanner, install, dismiss } = useInstallPrompt()
  const { isDark } = useTheme()

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={`fixed bottom-16 md:bottom-4 left-4 right-4 z-[60] max-w-md mx-auto rounded-2xl p-4 shadow-xl border ${
            isDark
              ? 'bg-navy-light border-slate-700'
              : 'bg-white border-stone-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">📲</span>
            <div className="flex-1 min-w-0">
              <p className={`font-heading font-semibold text-sm ${isDark ? 'text-white' : 'text-navy'}`}>
                Install EasyStudy
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                Add to your home screen for the best experience
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={dismiss}
                className={`text-xs font-heading font-medium px-3 py-1.5 rounded-lg ${
                  isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-stone-400 hover:bg-stone-100'
                }`}
              >
                Later
              </button>
              <button
                onClick={install}
                className="text-xs font-heading font-semibold px-3 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover"
              >
                Install
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
