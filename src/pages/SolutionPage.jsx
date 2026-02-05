import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useQuestionHistory } from '../hooks/useQuestionHistory'
import { useQuestionSolver } from '../hooks/useQuestionSolver'
import SolutionView from '../components/Solution/SolutionView'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function SolutionPage() {
  const { isDark } = useTheme()
  const { id } = useParams()
  const { history, toggleBookmark } = useQuestionHistory()
  const { expandedSteps, explainStep } = useQuestionSolver()
  const [item, setItem] = useState(null)

  useEffect(() => {
    const found = history.find(q => q.id === id)
    if (found) setItem(found)
  }, [id, history])

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <LoadingSpinner message="Loading solution..." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      {/* Question */}
      <div className={`rounded-2xl p-5 mb-6 ${isDark ? 'bg-navy-lighter' : 'bg-warm-gray'}`}>
        <p className={`text-xs font-heading font-bold uppercase tracking-wider mb-2 ${
          isDark ? 'text-slate-500' : 'text-stone-400'
        }`}>
          Your question
        </p>
        <p className={`font-body text-base ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
          {item.question}
        </p>
      </div>

      {/* Solution */}
      <SolutionView
        solution={item.solution}
        questionId={item.id}
        bookmarked={item.bookmarked}
        onToggleBookmark={() => toggleBookmark(item.id)}
        expandedSteps={expandedSteps}
        onExplainFurther={(stepIndex) => explainStep(stepIndex, item.question, item.subject)}
      />

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <Link to="/ask" className="btn-primary flex-1 text-center">
          Ask another question ✨
        </Link>
        <Link to="/history" className="btn-secondary flex-1 text-center">
          View history
        </Link>
      </div>
    </motion.div>
  )
}
