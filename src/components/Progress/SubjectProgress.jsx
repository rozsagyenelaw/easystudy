import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import TopicMastery from './TopicMastery'

export default function SubjectProgress({ subject, data }) {
  const { isDark } = useTheme()
  const [expanded, setExpanded] = useState(false)

  const accuracy = data.totalQuestions > 0
    ? Math.round((data.totalCorrect / data.totalQuestions) * 100)
    : 0

  const topicCount = Object.keys(data.topics || {}).length

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div>
          <h3 className={`font-heading font-semibold text-base ${isDark ? 'text-white' : 'text-navy'}`}>
            {subject}
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            {data.totalQuestions} questions · {topicCount} topics · {accuracy}% accuracy
          </p>
        </div>
        <span className={`text-lg transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 pt-1 border-t ${isDark ? 'border-slate-700' : 'border-stone-100'}`}>
              <TopicMastery topics={data.topics} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
