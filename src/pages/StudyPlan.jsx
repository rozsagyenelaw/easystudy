import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useStudyPlan } from '../hooks/useStudyPlan'
import { useProgress } from '../hooks/useProgress'
import GoalSetter from '../components/StudyPlan/GoalSetter'
import DailyPlan from '../components/StudyPlan/DailyPlan'
import PlanCalendar from '../components/StudyPlan/PlanCalendar'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function StudyPlan() {
  const { isDark } = useTheme()
  const { plan, loading, generating, error, todayPlan, generatePlan, toggleDayTask, clearPlan } = useStudyPlan()
  const { progress } = useProgress()

  const handleGenerate = (params) => {
    generatePlan({
      ...params,
      currentProgress: progress,
    })
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <LoadingSpinner message="Loading study plan..." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className={`font-heading font-bold text-2xl ${isDark ? 'text-white' : 'text-navy'}`}>
          Study Plan
        </h1>
        {plan && (
          <button
            onClick={clearPlan}
            className={`text-xs font-heading font-medium px-3 py-1.5 rounded-xl transition-colors ${
              isDark
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-red-500 hover:bg-red-50'
            }`}
          >
            Reset plan
          </button>
        )}
      </div>

      {error && (
        <div className={`rounded-2xl p-4 mb-4 border ${
          isDark ? 'bg-red-900/10 border-red-800/20' : 'bg-red-50 border-red-200'
        }`}>
          <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        </div>
      )}

      {!plan ? (
        /* Goal setting form */
        <div>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            Set a study goal and let AI create a personalized day-by-day plan for you.
          </p>
          <GoalSetter onGenerate={handleGenerate} generating={generating} />
        </div>
      ) : (
        /* Existing plan */
        <div className="space-y-6">
          {/* Plan goal */}
          <div className={`rounded-2xl p-4 border ${isDark ? 'bg-accent/10 border-accent/30' : 'bg-blue-50 border-accent/20'}`}>
            <p className={`text-xs font-heading font-bold uppercase tracking-wider mb-1 ${
              isDark ? 'text-accent' : 'text-accent'
            }`}>
              Your goal
            </p>
            <p className={`text-sm font-heading font-medium ${isDark ? 'text-white' : 'text-navy'}`}>
              {plan.goal}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              {plan.dailyMinutes} min/day · {plan.generatedPlan?.length || 0} days planned
              {plan.examDate && ` · Exam: ${new Date(plan.examDate + 'T12:00:00').toLocaleDateString()}`}
            </p>
          </div>

          {/* Today's plan */}
          <div>
            <h2 className={`font-heading font-semibold text-base mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
              Today
            </h2>
            <DailyPlan todayPlan={todayPlan} plan={plan} onToggleTask={toggleDayTask} />
          </div>

          {/* Calendar view */}
          <div>
            <h2 className={`font-heading font-semibold text-base mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
              Schedule
            </h2>
            <PlanCalendar plan={plan} onToggleTask={toggleDayTask} />
          </div>
        </div>
      )}
    </motion.div>
  )
}
