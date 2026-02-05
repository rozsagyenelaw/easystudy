import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { useQuestionHistory } from '../hooks/useQuestionHistory'
import { useStreaks } from '../hooks/useStreaks'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { useStudyPlan } from '../hooks/useStudyPlan'
import QuestionCard from '../components/Question/QuestionCard'
import StreakWidget from '../components/Streaks/StreakWidget'
import DailyGoalProgress from '../components/Streaks/DailyGoalProgress'

export default function Home() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const { history, toggleBookmark } = useQuestionHistory()
  const { streaks, todayData, dailyGoalMinutes, streakAtRisk } = useStreaks()
  const { dueItems } = useSpacedRepetition()
  const { todayPlan, plan } = useStudyPlan()

  const recentQuestions = history.slice(0, 3)
  const hasHistory = recentQuestions.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      {/* Hero */}
      <div className="text-center mb-8">
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
      <div className="text-center mb-8">
        <Link to="/ask" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
          {hasHistory ? 'Ask a new question' : 'Get started'} ✨
        </Link>
      </div>

      {/* Streak & daily goal (for returning users) */}
      {hasHistory && (
        <div className="space-y-3 mb-8">
          <StreakWidget currentStreak={streaks.currentStreak} streakAtRisk={streakAtRisk} />
          <DailyGoalProgress
            minutesStudied={todayData.minutesStudied}
            goalMinutes={dailyGoalMinutes}
            questionsAnswered={todayData.questionsAnswered}
          />
        </div>
      )}

      {/* Due for review */}
      {dueItems.length > 0 && (
        <div className={`rounded-2xl p-4 border mb-6 ${
          isDark ? 'bg-amber-900/10 border-amber-800/20' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`font-heading font-semibold text-sm ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              Due for Review ({dueItems.length})
            </h2>
            <Link to="/practice" className="text-xs font-heading font-medium text-accent">
              Review →
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {dueItems.slice(0, 4).map(item => (
              <span
                key={item.id}
                className={`px-2.5 py-1 rounded-full text-xs font-heading ${
                  isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.topic || item.subject}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Today's study plan */}
      {todayPlan && (
        <div className={`rounded-2xl p-4 border mb-6 ${isDark ? 'bg-accent/5 border-accent/20' : 'bg-blue-50/50 border-accent/10'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`font-heading font-semibold text-sm ${isDark ? 'text-accent' : 'text-accent'}`}>
              Today's Plan
            </h2>
            <Link to="/study-plan" className="text-xs font-heading font-medium text-accent">
              View full plan →
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {todayPlan.topics?.map((topic, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-full text-xs font-heading ${
                  isDark ? 'bg-slate-700 text-slate-300' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {topic}
              </span>
            ))}
          </div>
          <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
            ~{todayPlan.estimatedMinutes || 20} min
          </p>
        </div>
      )}

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
          to="/study-plan"
          className={`rounded-2xl p-5 text-center transition-colors ${
            isDark ? 'bg-navy-light border border-slate-700 hover:border-slate-600' : 'bg-white border border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-3xl mb-2">📅</div>
          <h3 className={`font-heading font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-navy'}`}>
            Study Plan
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            AI-generated personalized schedule
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
        <Link
          to="/progress"
          className={`rounded-2xl p-5 text-center transition-colors ${
            isDark ? 'bg-navy-light border border-slate-700 hover:border-slate-600' : 'bg-white border border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-3xl mb-2">📊</div>
          <h3 className={`font-heading font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-navy'}`}>
            Progress
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            Track mastery and study activity
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
