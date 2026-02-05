import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { loginWithGoogle, loginWithEmail, signupWithEmail, continueAsGuest } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signupWithEmail(email, password)
      } else {
        await loginWithEmail(email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim() || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Try again.')
      }
    }
  }

  const handleGuest = () => {
    continueAsGuest()
    navigate('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-sm mx-auto px-4 py-12 pb-24"
    >
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">📖</div>
        <h1 className={`font-heading font-bold text-2xl mb-1 ${isDark ? 'text-white' : 'text-navy'}`}>
          {mode === 'signup' ? 'Create account' : 'Welcome back'}
        </h1>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          {mode === 'signup' ? 'Start learning smarter today' : 'Sign in to sync your progress'}
        </p>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        className={`w-full py-3 px-4 rounded-xl font-heading font-medium text-sm flex items-center justify-center gap-3 transition-colors mb-4 ${
          isDark
            ? 'bg-white text-navy hover:bg-stone-100'
            : 'bg-white text-navy border border-stone-300 hover:bg-stone-50'
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`} />
        <span className={`text-xs font-heading ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>or</span>
        <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`} />
      </div>

      {/* Email form */}
      <form onSubmit={handleEmailSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all ${
            isDark
              ? 'bg-navy-lighter border border-slate-600 text-white placeholder:text-slate-500 focus:border-accent'
              : 'bg-warm-gray border border-stone-300 text-navy placeholder:text-stone-400 focus:border-accent'
          }`}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all ${
            isDark
              ? 'bg-navy-lighter border border-slate-600 text-white placeholder:text-slate-500 focus:border-accent'
              : 'bg-warm-gray border border-stone-300 text-navy placeholder:text-stone-400 focus:border-accent'
          }`}
        />

        {error && (
          <p className="text-red-400 text-xs font-heading" role="alert">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? 'Loading...' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      {/* Toggle mode */}
      <p className={`text-center text-sm mt-4 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
          className="text-accent font-heading font-medium"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </button>
      </p>

      {/* Guest */}
      <div className="text-center mt-6">
        <button
          onClick={handleGuest}
          className={`text-sm font-heading ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-stone-400 hover:text-stone-600'}`}
        >
          Continue as guest →
        </button>
      </div>
    </motion.div>
  )
}
