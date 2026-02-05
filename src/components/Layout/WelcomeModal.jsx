import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

const SEEN_KEY = 'easystudy-welcome-seen'

export default function WelcomeModal() {
  const { isDark } = useTheme()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) {
      setShow(true)
    }
  }, [])

  const dismiss = () => {
    setShow(false)
    localStorage.setItem(SEEN_KEY, 'true')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`max-w-sm w-full rounded-3xl p-8 text-center shadow-2xl ${
              isDark ? 'bg-navy-light' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">📖✨</div>
            <h2 className={`font-heading font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-navy'}`}>
              Welcome to EasyStudy!
            </h2>
            <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
              EasyStudy helps you learn step by step. Use it to <strong>understand</strong> — not to copy.
              Try solving each step yourself before revealing the next one.
            </p>
            <button onClick={dismiss} className="btn-primary w-full">
              Let's go! 🚀
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
