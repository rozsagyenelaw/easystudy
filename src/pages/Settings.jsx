import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { useStreaks } from '../hooks/useStreaks'
import { useNotifications } from '../hooks/useNotifications'
import ThemeToggle from '../components/Layout/ThemeToggle'

const DEPTH_OPTIONS = [
  { value: 'basic', label: 'Basic' },
  { value: 'standard', label: 'Standard' },
  { value: 'deep', label: 'Deep' },
]

const GOAL_OPTIONS = [10, 15, 20, 30, 45, 60]

export default function Settings() {
  const { isDark } = useTheme()
  const { user, logout } = useAuth()
  const { dailyGoalMinutes, setDailyGoal } = useStreaks()
  const { settings: notifSettings, permission, requestPermission, updateSettings, isSupported } = useNotifications()
  const [defaultDepth, setDefaultDepth] = useState(
    () => localStorage.getItem('easystudy-default-depth') || 'standard'
  )
  const [cleared, setCleared] = useState(false)

  const handleDepthChange = (value) => {
    setDefaultDepth(value)
    localStorage.setItem('easystudy-default-depth', value)
  }

  const handleClearHistory = () => {
    localStorage.removeItem('easystudy-history')
    setCleared(true)
    setTimeout(() => setCleared(false), 2000)
  }

  const handleEnableNotifications = async () => {
    const granted = await requestPermission()
    if (!granted) {
      alert('Notifications permission was denied. You can enable it from your browser settings.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      <h1 className={`font-heading font-bold text-2xl mb-8 ${isDark ? 'text-white' : 'text-navy'}`}>
        Settings
      </h1>

      <div className="space-y-6">
        {/* Account */}
        {user && (
          <section className={`rounded-2xl p-5 border ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
            <h2 className={`font-heading font-semibold text-base mb-4 ${isDark ? 'text-white' : 'text-navy'}`}>
              Account
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=3b82f6&color=fff&size=40`}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className={`font-heading font-medium text-sm ${isDark ? 'text-white' : 'text-navy'}`}>
                  {user.displayName || 'User'}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/profile"
                className={`text-sm font-heading font-medium px-4 py-2 rounded-xl transition-colors ${
                  isDark
                    ? 'text-accent hover:bg-accent/10'
                    : 'text-accent hover:bg-blue-50'
                }`}
              >
                View profile
              </Link>
              <button
                onClick={logout}
                className={`text-sm font-heading font-medium px-4 py-2 rounded-xl transition-colors ${
                  isDark
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-red-500 hover:bg-red-50'
                }`}
              >
                Sign out
              </button>
            </div>
          </section>
        )}

        {/* Guest prompt */}
        {!user && (
          <section className={`rounded-2xl p-5 border ${isDark ? 'bg-accent/10 border-accent/30' : 'bg-blue-50 border-accent/20'}`}>
            <h2 className={`font-heading font-semibold text-base mb-2 ${isDark ? 'text-white' : 'text-navy'}`}>
              Create an account
            </h2>
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              Sign in to sync your progress across devices and unlock all features.
            </p>
            <Link to="/login" className="btn-primary text-sm inline-block">
              Sign in
            </Link>
          </section>
        )}

        {/* Appearance */}
        <section className={`rounded-2xl p-5 border ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-heading font-semibold text-base mb-4 ${isDark ? 'text-white' : 'text-navy'}`}>
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>Dark mode</span>
            <ThemeToggle />
          </div>
        </section>

        {/* Study preferences */}
        <section className={`rounded-2xl p-5 border ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-heading font-semibold text-base mb-4 ${isDark ? 'text-white' : 'text-navy'}`}>
            Study Preferences
          </h2>

          {/* Default depth */}
          <div className="mb-5">
            <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
              Default explanation depth
            </label>
            <div className={`inline-flex rounded-xl p-1 ${isDark ? 'bg-navy-lighter' : 'bg-stone-100'}`}>
              {DEPTH_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleDepthChange(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-heading font-medium transition-all duration-200 ${
                    defaultDepth === value
                      ? 'bg-accent text-white'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily goal */}
          <div>
            <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
              Daily study goal
            </label>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map(min => (
                <button
                  key={min}
                  onClick={() => setDailyGoal(min)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-heading font-medium transition-colors ${
                    dailyGoalMinutes === min
                      ? 'bg-accent text-white'
                      : isDark
                      ? 'bg-navy-lighter text-slate-400 hover:text-slate-200'
                      : 'bg-stone-100 text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notifications */}
        {isSupported && (
          <section className={`rounded-2xl p-5 border ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
            <h2 className={`font-heading font-semibold text-base mb-4 ${isDark ? 'text-white' : 'text-navy'}`}>
              Notifications
            </h2>

            {permission !== 'granted' ? (
              <div>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                  Get reminders to study, streak alerts, and review notifications.
                </p>
                <button
                  onClick={handleEnableNotifications}
                  className="btn-secondary text-sm"
                >
                  Enable notifications
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { key: 'dailyReminder', label: 'Daily study reminder' },
                  { key: 'streakReminder', label: 'Streak at risk alert' },
                  { key: 'reviewReminder', label: 'Spaced repetition reminders' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>{label}</span>
                    <button
                      onClick={() => updateSettings({ [key]: !notifSettings[key] })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifSettings[key]
                          ? 'bg-accent'
                          : isDark ? 'bg-slate-600' : 'bg-stone-300'
                      }`}
                      role="switch"
                      aria-checked={notifSettings[key]}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                        notifSettings[key] ? 'left-[1.625rem]' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                ))}

                {/* Reminder time */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>Reminder time</span>
                  <input
                    type="time"
                    value={notifSettings.reminderTime}
                    onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                    className={`px-2 py-1 rounded-lg text-sm border ${
                      isDark
                        ? 'bg-navy-lighter border-slate-600 text-white'
                        : 'bg-white border-stone-300 text-stone-700'
                    }`}
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Data */}
        <section className={`rounded-2xl p-5 border ${isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-heading font-semibold text-base mb-4 ${isDark ? 'text-white' : 'text-navy'}`}>
            Data
          </h2>
          <button
            onClick={handleClearHistory}
            className={`text-sm font-heading font-medium px-4 py-2 rounded-xl transition-colors ${
              cleared
                ? 'text-emerald bg-emerald/10'
                : isDark
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-red-500 hover:bg-red-50'
            }`}
          >
            {cleared ? 'History cleared ✓' : 'Clear local history'}
          </button>
        </section>

        {/* Academic integrity notice */}
        <section className={`rounded-2xl p-5 border ${isDark ? 'bg-amber-900/10 border-amber-800/20' : 'bg-amber-50 border-amber-200'}`}>
          <p className={`text-sm font-heading font-medium mb-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
            Academic Integrity
          </p>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-amber-400/70' : 'text-amber-600'}`}>
            EasyStudy helps you understand, not just copy answers. Use solutions to learn the process, not to submit as your own work.
          </p>
        </section>
      </div>
    </motion.div>
  )
}
