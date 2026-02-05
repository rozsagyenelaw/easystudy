import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

export default function ExampleQuestion({ example, index }) {
  const { isDark } = useTheme()
  const [revealedSteps, setRevealedSteps] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const revealNext = () => {
    if (revealedSteps < example.steps.length) {
      setRevealedSteps(r => r + 1)
    }
  }

  return (
    <div className={`rounded-2xl border p-5 ${
      isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'
    }`}>
      <p className={`font-heading font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-navy'}`}>
        Q{index + 1}: {example.question}
      </p>

      {/* Steps */}
      <div className="space-y-2 mb-4">
        {example.steps.map((step, i) => (
          <AnimatePresence key={i}>
            {i < revealedSteps && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`rounded-xl p-3 ${isDark ? 'bg-slate-700/50' : 'bg-stone-50'}`}
              >
                <p className={`text-xs font-heading font-semibold mb-1 ${isDark ? 'text-accent' : 'text-accent'}`}>
                  {step.title}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  {step.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Reveal step button */}
      {revealedSteps < example.steps.length && (
        <button
          onClick={revealNext}
          className={`text-sm font-heading font-medium px-4 py-2 rounded-xl transition-colors ${
            isDark
              ? 'bg-slate-700 text-slate-300 hover:text-white'
              : 'bg-stone-100 text-stone-600 hover:text-navy'
          }`}
        >
          Show step {revealedSteps + 1} of {example.steps.length}
        </button>
      )}

      {/* Answer */}
      {revealedSteps === example.steps.length && (
        <div className="mt-3">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="btn-primary text-sm px-4 py-2"
            >
              Show answer
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-xl p-4 border-l-4 border-accent ${
                isDark ? 'bg-accent/10' : 'bg-blue-50'
              }`}
            >
              <p className={`text-sm font-heading font-medium ${isDark ? 'text-white' : 'text-navy'}`}>
                {example.answer}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
