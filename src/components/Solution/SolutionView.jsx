import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import MathRenderer from '../Common/MathRenderer'
import StepCard from './StepCard'
import StepRevealButton from './StepRevealButton'
import AlternativeMethod from './AlternativeMethod'
import FeedbackButton from './FeedbackButton'
import BookmarkButton from './BookmarkButton'
import ExportPDFButton from './ExportPDFButton'
import ShareButton from './ShareButton'

export default function SolutionView({
  solution,
  questionId,
  questionData,
  bookmarked,
  onToggleBookmark,
  expandedSteps,
  onExplainFurther,
}) {
  const { isDark } = useTheme()
  const [revealedCount, setRevealedCount] = useState(1)

  if (!solution) return null

  const isQuick = solution._mode === 'quick' || (!solution.steps?.length && solution.final_answer)

  const steps = solution.steps || []
  const totalSteps = steps.length
  const visibleSteps = steps.slice(0, revealedCount)
  const hasMore = revealedCount < totalSteps
  const allRevealed = revealedCount >= totalSteps

  if (isQuick) {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
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
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-heading font-medium ${
              isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'
            }`}>
              Quick Answer
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <BookmarkButton bookmarked={bookmarked} onToggle={onToggleBookmark} />
            {questionData && <ShareButton questionData={questionData} />}
            <ExportPDFButton elementId="solution-export" filename={`easystudy-${questionId}`} />
          </div>
        </div>

        {/* Quick answer content */}
        <div id="solution-export">
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
              Answer
            </p>
            <div className={`text-lg font-body ${isDark ? 'text-white' : 'text-navy'}`}>
              <MathRenderer text={solution.final_answer} />
            </div>
          </motion.div>
        </div>

        {/* Feedback */}
        <div className={`pt-4 border-t ${isDark ? 'border-slate-700' : 'border-stone-200'}`}>
          <FeedbackButton questionId={questionId} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
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
        <div className="flex items-center gap-2 flex-wrap">
          <BookmarkButton bookmarked={bookmarked} onToggle={onToggleBookmark} />
          {questionData && <ShareButton questionData={questionData} />}
          <ExportPDFButton elementId="solution-export" filename={`easystudy-${questionId}`} />
        </div>
      </div>

      {/* Exportable content wrapper */}
      <div id="solution-export">
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
            className={`rounded-2xl p-6 border-2 mt-5 ${
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
          <div className="mt-5">
            <AlternativeMethod method={solution.alternative_method} />
          </div>
        )}

        {/* Key concepts */}
        {allRevealed && solution.key_concepts?.length > 0 && (
          <div className="mt-5">
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
      </div>

      {/* Feedback */}
      {allRevealed && (
        <div className={`pt-4 border-t ${isDark ? 'border-slate-700' : 'border-stone-200'}`}>
          <FeedbackButton questionId={questionId} />
        </div>
      )}
    </div>
  )
}
