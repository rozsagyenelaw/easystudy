import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import ProfilePage from '../components/Profile/ProfilePage'

export default function Profile() {
  const { isDark } = useTheme()
  const { user } = useAuth()

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 py-8 pb-24 text-center"
      >
        <p className="text-4xl mb-3">👤</p>
        <h1 className={`font-heading font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-navy'}`}>
          Profile
        </h1>
        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          Sign in to see your profile, track achievements, and sync your progress across devices.
        </p>
        <Link to="/login" className="btn-primary inline-block">
          Sign in
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      <h1 className={`font-heading font-bold text-2xl mb-6 ${isDark ? 'text-white' : 'text-navy'}`}>
        Profile
      </h1>
      <ProfilePage />
    </motion.div>
  )
}
