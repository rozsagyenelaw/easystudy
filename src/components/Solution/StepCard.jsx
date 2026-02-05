import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import MathRenderer from '../Common/MathRenderer'
import ExplainFurtherButton from './ExplainFurtherButton'

export default function StepCard({ step, stepIndex, expandedStep, onExplainFurther }) {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`rounded-2xl p-5 border ${
        isDark
          ? 'bg-navy-light border-slate-700'
          : 'bg-white border-stone-200'
      }`}
      role="article"
      aria-label={`Step ${step.step_number}: ${step.title}`}
    >
      {/* Step header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="shrink-0 w-8 h-8 rounded-full bg-accent text-white text-sm font-heading font-bold flex items-center justify-center">
          {step.step_number}
        </span>
        <h3 className={`font-heading font-semibold text-base pt-1 ${isDark ? 'text-white' : 'text-navy'}`}>
          {step.title}
        </h3>
      </div>

      {/* Explanation */}
      <div className={`ml-11 space-y-3 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
        <div className="text-sm leading-relaxed">
          <MathRenderer text={step.explanation} />
        </div>

        {/* Formula */}
        {step.formula && (
          <div className={`rounded-xl p-4 text-center ${
            isDark ? 'bg-navy/60' : 'bg-blue-50/50'
          }`}>
            <MathRenderer text={`$$${step.formula}$$`} />
          </div>
        )}

        {/* Intermediate result */}
        {step.intermediate_result && (
          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-emerald' : 'text-emerald'}`}>
            <span className="font-heading font-medium">→</span>
            <MathRenderer text={step.intermediate_result} />
          </div>
        )}

        {/* Expanded explanation */}
        {expandedStep?.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`rounded-xl p-4 mt-3 border-l-3 border-accent ${
              isDark ? 'bg-accent/5' : 'bg-blue-50'
            }`}
          >
            <p className={`text-xs font-heading font-medium mb-2 ${isDark ? 'text-accent' : 'text-accent'}`}>
              Deeper explanation
            </p>
            <div className="text-sm leading-relaxed">
              <MathRenderer text={expandedStep.explanation.detailed_explanation} />
            </div>
            {expandedStep.explanation.sub_steps?.length > 0 && (
              <div className="mt-3 space-y-2">
                {expandedStep.explanation.sub_steps.map((sub, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-heading font-medium">{sub.title}: </span>
                    <MathRenderer text={sub.explanation} />
                  </div>
                ))}
              </div>
            )}
            {expandedStep.explanation.intuition && (
              <p className={`mt-3 text-sm italic ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                💡 {expandedStep.explanation.intuition}
              </p>
            )}
          </motion.div>
        )}

        {expandedStep?.error && (
          <p className="text-sm text-red-400">{expandedStep.error}</p>
        )}

        {/* Explain further button */}
        <ExplainFurtherButton
          loading={expandedStep?.loading}
          expanded={!!expandedStep?.explanation}
          onClick={() => onExplainFurther(stepIndex)}
        />
      </div>
    </motion.div>
  )
}
