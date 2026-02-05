import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import { useProgress } from '../../hooks/useProgress'
import { useStreaks } from '../../hooks/useStreaks'
import { useAchievements } from '../../hooks/useAchievements'
import ProgressSummary from '../Progress/ProgressSummary'
import StreakCalendar from '../Streaks/StreakCalendar'
import AchievementsList from './AchievementsList'

export default function ProfilePage() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const { stats, progress } = useProgress()
  const { streaks, last30Days } = useStreaks()
  const { earned, allAchievements } = useAchievements()

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  const handleExportData = () => {
    const data = {
      progress: JSON.parse(localStorage.getItem('easystudy-progress') || '{}'),
      history: JSON.parse(localStorage.getItem('easystudy-history') || '[]'),
      streaks: JSON.parse(localStorage.getItem('easystudy-streaks') || '{}'),
      achievements: JSON.parse(localStorage.getItem('easystudy-achievements') || '[]'),
      spacedRepetition: JSON.parse(localStorage.getItem('easystudy-spaced-rep') || '{}'),
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `easystudy-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile header */}
      <div className={`rounded-2xl p-6 border text-center ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'Student')}&background=3b82f6&color=fff&size=80`}
          alt=""
          className="w-20 h-20 rounded-full mx-auto mb-3"
        />
        <h2 className={`font-heading font-bold text-xl ${isDark ? 'text-white' : 'text-navy'}`}>
          {user?.displayName || 'Student'}
        </h2>
        {user?.email && (
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{user.email}</p>
        )}
        {memberSince && (
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
            Member since {memberSince}
          </p>
        )}
      </div>

      {/* Stats */}
      <ProgressSummary stats={stats} streakData={streaks} />

      {/* Study heatmap */}
      <div className={`rounded-2xl p-5 border ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
        <h3 className={`font-heading font-semibold text-base mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
          Study Activity
        </h3>
        <StreakCalendar last30Days={last30Days} />
      </div>

      {/* Achievements */}
      <div>
        <h3 className={`font-heading font-semibold text-base mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
          Achievements ({earned.length}/{allAchievements.length})
        </h3>
        <AchievementsList earned={earned} allAchievements={allAchievements} />
      </div>

      {/* Export */}
      <button
        onClick={handleExportData}
        className={`w-full text-sm font-heading font-medium px-4 py-3 rounded-xl transition-colors ${
          isDark
            ? 'bg-navy-lighter text-slate-300 hover:bg-slate-600'
            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
        }`}
      >
        Export my data
      </button>
    </motion.div>
  )
}
