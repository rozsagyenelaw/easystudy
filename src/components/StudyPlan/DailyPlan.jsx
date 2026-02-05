import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import StudyPlanCard from './StudyPlanCard'

export default function DailyPlan({ todayPlan, plan, onToggleTask }) {
  const { isDark } = useTheme()

  if (!todayPlan) {
    return (
      <div className={`rounded-2xl p-6 border text-center ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
        <p className={`text-3xl mb-2`}>📅</p>
        <p className={`text-sm font-heading font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
          No plan for today
        </p>
        <p className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
          {plan ? 'Check your plan calendar for upcoming tasks.' : 'Create a study plan to get personalized daily tasks.'}
        </p>
        {!plan && (
          <Link to="/study-plan" className="text-sm font-heading font-medium text-accent hover:text-accent-hover">
            Create a plan →
          </Link>
        )}
      </div>
    )
  }

  const todayIndex = plan?.generatedPlan?.findIndex(d => d.date === new Date().toISOString().split('T')[0]) ?? -1

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <StudyPlanCard
        day={todayPlan}
        dayIndex={todayIndex}
        onToggleTask={onToggleTask}
      />
      {todayPlan.topics?.length > 0 && (
        <div className="mt-3">
          <Link
            to={`/practice?subject=${encodeURIComponent(plan?.subjects?.[0] || '')}&topic=${encodeURIComponent(todayPlan.topics[0] || '')}`}
            className="btn-secondary text-sm w-full text-center block"
          >
            Practice {todayPlan.topics[0]} →
          </Link>
        </div>
      )}
    </motion.div>
  )
}
