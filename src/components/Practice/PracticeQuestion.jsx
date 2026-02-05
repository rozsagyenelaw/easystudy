import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import MathRenderer from '../Common/MathRenderer'
import HintButton from './HintButton'
import StepCard from '../Solution/StepCard'

export default function PracticeQuestion({
  question,
  questionIndex,
  total,
  answer,
  onAnswerChange,
  revealedHintCount,
  onRevealHint,
  solutionRevealed,
  onRevealSolution,
  timerEnabled,
  timePerQuestion,
  onTimeUp,
}) {
  const { isDark } = useTheme()
  const [timeLeft, setTimeLeft] = useState(timePerQuestion)
  const intervalRef = useRef(null)

  useEffect(() => {
    setTimeLeft(timePerQuestion)
    if (timerEnabled && !solutionRevealed) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            onTimeUp?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [questionIndex, timerEnabled, solutionRevealed, timePerQuestion, onTimeUp])

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <motion.div
      key={questionIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-heading font-medium ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          Question {questionIndex + 1} of {total}
        </span>
        {timerEnabled && !solutionRevealed && (
          <span className={`text-sm font-heading font-bold tabular-nums ${
            timeLeft <= 30 ? 'text-red-400' : isDark ? 'text-slate-300' : 'text-stone-600'
          }`}>
            ⏱ {formatTime(timeLeft)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`}>
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${((questionIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className={`rounded-2xl p-5 ${isDark ? 'bg-navy-light border border-slate-700' : 'bg-white border border-stone-200'}`}>
        <div className={`text-base ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
          <MathRenderer text={question.question_text} />
        </div>
      </div>

      {/* Answer input */}
      {!solutionRevealed && (
        <div>
          <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            Your answer
          </label>
          <textarea
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={3}
            className={`w-full rounded-2xl px-5 py-4 text-base resize-none outline-none font-body ${
              isDark
                ? 'bg-navy-lighter border border-slate-600 text-warm-white placeholder:text-slate-500 focus:border-accent'
                : 'bg-warm-gray border border-stone-300 text-navy placeholder:text-stone-400 focus:border-accent'
            }`}
          />
        </div>
      )}

      {/* Hints */}
      <HintButton
        hints={question.hints || []}
        revealedCount={revealedHintCount}
        onReveal={onRevealHint}
      />

      {/* Show solution button */}
      {!solutionRevealed && (
        <button
          type="button"
          onClick={onRevealSolution}
          className={`text-sm font-heading font-medium px-4 py-2 rounded-xl transition-colors ${
            isDark ? 'text-accent hover:bg-accent/10' : 'text-accent hover:bg-blue-50'
          }`}
        >
          Show full solution
        </button>
      )}

      {/* Solution */}
      {solutionRevealed && question.solution && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className={`text-xs font-heading font-bold uppercase tracking-wider ${isDark ? 'text-emerald' : 'text-emerald-600'}`}>
            Solution
          </p>
          {question.solution.steps?.map((step, i) => (
            <StepCard key={i} step={step} stepIndex={i} onExplainFurther={() => {}} />
          ))}
          {question.solution.final_answer && (
            <div className={`rounded-2xl p-5 border-2 ${isDark ? 'bg-emerald/5 border-emerald/30' : 'bg-emerald-50 border-emerald/20'}`}>
              <p className={`text-xs font-heading font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-emerald' : 'text-emerald-600'}`}>
                Final Answer
              </p>
              <div className={`text-base ${isDark ? 'text-white' : 'text-navy'}`}>
                <MathRenderer text={question.solution.final_answer} />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
