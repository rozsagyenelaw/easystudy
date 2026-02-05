import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useProgress } from '../hooks/useProgress'
import { useStreaks } from '../hooks/useStreaks'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import ProgressSummary from '../components/Progress/ProgressSummary'
import ProgressChart from '../components/Progress/ProgressChart'
import SubjectProgress from '../components/Progress/SubjectProgress'
import MasteryBadge from '../components/Progress/MasteryBadge'

export default function Progress() {
  const { isDark } = useTheme()
  const { progress, stats, weakestTopics, loading } = useProgress()
  const { streaks } = useStreaks()
  const { dueItems } = useSpacedRepetition()

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 text-center">
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>Loading progress...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      <h1 className={`font-heading font-bold text-2xl mb-6 ${isDark ? 'text-white' : 'text-navy'}`}>
        Progress
      </h1>

      {/* Overall stats */}
      <div className="mb-6">
        <ProgressSummary stats={stats} streakData={streaks} />
      </div>

      {/* Activity chart */}
      <div className={`rounded-2xl p-5 border mb-6 ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
        <h2 className={`font-heading font-semibold text-base mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
          Activity
        </h2>
        <ProgressChart studyDays={streaks.studyDays} />
      </div>

      {/* Due for review */}
      {dueItems.length > 0 && (
        <div className={`rounded-2xl p-5 border mb-6 ${
          isDark ? 'bg-amber-900/10 border-amber-800/20' : 'bg-amber-50 border-amber-200'
        }`}>
          <h2 className={`font-heading font-semibold text-base mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
            Due for Review ({dueItems.length})
          </h2>
          <div className="space-y-2">
            {dueItems.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-heading font-medium ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
                    {item.topic || item.question?.slice(0, 40)}
                  </span>
                  <span className={`text-xs ml-2 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                    {item.subject}
                  </span>
                </div>
                <Link
                  to={`/practice?subject=${encodeURIComponent(item.subject)}&topic=${encodeURIComponent(item.topic || '')}`}
                  className="text-xs font-heading font-medium text-accent"
                >
                  Review →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weakest topics */}
      {weakestTopics.length > 0 && (
        <div className={`rounded-2xl p-5 border mb-6 ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-heading font-semibold text-base mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
            Needs Work
          </h2>
          <div className="space-y-2">
            {weakestTopics.map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>{t.topic}</span>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>({t.subject})</span>
                </div>
                <MasteryBadge level={t.masteryLevel} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-subject breakdown */}
      {Object.keys(progress).length > 0 ? (
        <div>
          <h2 className={`font-heading font-semibold text-base mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
            By Subject
          </h2>
          <div className="space-y-3">
            {Object.entries(progress).map(([subject, data]) => (
              <SubjectProgress key={subject} subject={subject} data={data} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📊</p>
          <p className={`font-heading font-medium text-base mb-1 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            No progress data yet
          </p>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
            Start solving questions and practicing to track your progress.
          </p>
          <Link to="/ask" className="btn-primary inline-block">
            Get started ✨
          </Link>
        </div>
      )}
    </motion.div>
  )
}
