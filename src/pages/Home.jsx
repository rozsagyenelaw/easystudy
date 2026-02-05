import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { useQuestionHistory } from '../hooks/useQuestionHistory'
import QuestionCard from '../components/Question/QuestionCard'

export default function Home() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const { history, toggleBookmark } = useQuestionHistory()

  const recentQuestions = history.slice(0, 3)
  const hasHistory = recentQuestions.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      {/* Hero */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4"
        >
          📖
        </motion.div>
        <h1 className={`font-heading font-bold text-3xl mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
          {hasHistory
            ? `Welcome back${user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!`
            : 'Study smarter, not harder'}
        </h1>
        <p className={`text-base max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          {hasHistory
            ? 'Continue where you left off or explore something new.'
            : 'Get step-by-step explanations for any subject. Understand the process, not just the answer.'}
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mb-10">
        <Link to="/ask" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
          {hasHistory ? 'Ask a new question' : 'Get started'} ✨
        </Link>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link
          to="/practice"
          className={`rounded-2xl p-5 text-center transition-colors ${
            isDark ? 'bg-navy-light border border-slate-700 hover:border-slate-600' : 'bg-white border border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-3xl mb-2">🎯</div>
          <h3 className={`font-heading font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-navy'}`}>
            Practice Mode
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            Test yourself with AI-generated questions
          </p>
        </Link>
        <Link
          to="/formulas"
          className={`rounded-2xl p-5 text-center transition-colors ${
            isDark ? 'bg-navy-light border border-slate-700 hover:border-slate-600' : 'bg-white border border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-3xl mb-2">📐</div>
          <h3 className={`font-heading font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-navy'}`}>
            Formula Sheets
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            Quick reference for common formulas
          </p>
        </Link>
      </div>

      {/* Recent questions */}
      {hasHistory && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-heading font-semibold text-lg ${isDark ? 'text-white' : 'text-navy'}`}>
              Recent questions
            </h2>
            <Link
              to="/history"
              className="text-sm font-heading font-medium text-accent"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentQuestions.map((item) => (
              <QuestionCard key={item.id} item={item} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        </div>
      )}

      {/* Features for new users */}
      {!hasHistory && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: '📝', title: 'Ask anything', desc: 'Math, Physics, Chemistry, Biology, History & more' },
            { icon: '👣', title: 'Step by step', desc: 'Progressive reveal — try each step before peeking' },
            { icon: '🧠', title: 'Understand deeply', desc: 'Get detailed explanations, alternatives & key concepts' },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className={`rounded-2xl p-5 text-center ${
                isDark ? 'bg-navy-light border border-slate-700' : 'bg-white border border-stone-200'
              }`}
            >
              <div className="text-3xl mb-2">{icon}</div>
              <h3 className={`font-heading font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-navy'}`}>
                {title}
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{desc}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
