import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import MathRenderer from '../Common/MathRenderer'

export default function AlternativeMethod({ method }) {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)

  if (!method) return null

  return (
    <div className={`rounded-2xl border ${isDark ? 'border-slate-700' : 'border-stone-200'}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-5 py-4 flex items-center justify-between text-left rounded-2xl transition-colors ${
          isDark ? 'hover:bg-navy-lighter' : 'hover:bg-stone-50'
        }`}
        aria-expanded={open}
      >
        <div>
          <span className={`text-sm font-heading font-semibold ${isDark ? 'text-white' : 'text-navy'}`}>
            🔄 Alternative: {method.name}
          </span>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            {method.brief_description}
          </p>
        </div>
        <span className={`text-lg transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {method.steps?.map((step, i) => (
                <div key={i} className={`rounded-xl p-4 ${isDark ? 'bg-navy/60' : 'bg-stone-50'}`}>
                  <div className="flex items-start gap-2">
                    <span className={`text-xs font-heading font-bold ${isDark ? 'text-accent' : 'text-accent'}`}>
                      {step.step_number || i + 1}.
                    </span>
                    <div>
                      <p className={`font-heading font-medium text-sm ${isDark ? 'text-white' : 'text-navy'}`}>
                        {step.title}
                      </p>
                      <div className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                        <MathRenderer text={step.explanation} />
                      </div>
                      {step.formula && (
                        <div className="mt-2">
                          <MathRenderer text={`$$${step.formula}$$`} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
