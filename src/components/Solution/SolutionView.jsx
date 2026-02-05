import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import MathRenderer from '../Common/MathRenderer'
import StepCard from './StepCard'
import StepRevealButton from './StepRevealButton'
import AlternativeMethod from './AlternativeMethod'
import FeedbackButton from './FeedbackButton'
import BookmarkButton from './BookmarkButton'

export default function SolutionView({
  solution,
  questionId,
  bookmarked,
  onToggleBookmark,
  expandedSteps,
  onExplainFurther,
}) {
  const { isDark } = useTheme()
  const [revealedCount, setRevealedCount] = useState(1)

  if (!solution) return null

  const steps = solution.steps || []
  const totalSteps = steps.length
  const visibleSteps = steps.slice(0, revealedCount)
  const hasMore = revealedCount < totalSteps
  const allRevealed = revealedCount >= totalSteps

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-heading font-medium ${
              isDark ? 'bg-accent/20 text-accent' : 'bg-blue-50 text-accent'
            }`}>
              {solution.subject_detected}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-heading font-medium ${
              isDark ? 'bg-slate-700 text-slate-300' : 'bg-stone-100 text-stone-500'
            }`}>
              {solution.topic}
            </span>
          </div>
        </div>
        <BookmarkButton bookmarked={bookmarked} onToggle={onToggleBookmark} />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {visibleSteps.map((step, i) => (
          <StepCard
            key={i}
            step={step}
            stepIndex={i}
            expandedStep={expandedSteps?.[i]}
            onExplainFurther={onExplainFurther}
          />
        ))}
      </div>

      {/* Reveal button */}
      {hasMore && (
        <StepRevealButton
          onReveal={() => setRevealedCount(c => c + 1)}
          stepsRemaining={totalSteps - revealedCount}
        />
      )}

      {/* Final answer */}
      {allRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 border-2 ${
            isDark
              ? 'bg-emerald/5 border-emerald/30'
              : 'bg-emerald-50 border-emerald/20'
          }`}
        >
          <p className={`text-xs font-heading font-bold uppercase tracking-wider mb-2 ${
            isDark ? 'text-emerald' : 'text-emerald-600'
          }`}>
            Final Answer
          </p>
          <div className={`text-lg font-body ${isDark ? 'text-white' : 'text-navy'}`}>
            <MathRenderer text={solution.final_answer} />
          </div>
        </motion.div>
      )}

      {/* Alternative method */}
      {allRevealed && solution.alternative_method && (
        <AlternativeMethod method={solution.alternative_method} />
      )}

      {/* Key concepts */}
      {allRevealed && solution.key_concepts?.length > 0 && (
        <div>
          <p className={`text-xs font-heading font-bold uppercase tracking-wider mb-2 ${
            isDark ? 'text-slate-400' : 'text-stone-500'
          }`}>
            Key Concepts
          </p>
          <div className="flex flex-wrap gap-2">
            {solution.key_concepts.map((concept, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-heading ${
                  isDark
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {allRevealed && (
        <div className={`pt-4 border-t ${isDark ? 'border-slate-700' : 'border-stone-200'}`}>
          <FeedbackButton questionId={questionId} />
        </div>
      )}
    </div>
  )
}
