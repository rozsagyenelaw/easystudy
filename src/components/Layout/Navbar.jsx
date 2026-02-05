import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/ask', label: 'Ask', icon: '✨' },
  { to: '/history', label: 'History', icon: '📚' },
  { to: '/bookmarks', label: 'Saved', icon: '🔖' },
]

export default function Navbar() {
  const { isDark } = useTheme()
  const { user, isGuest } = useAuth()
  const location = useLocation()

  return (
    <>
      {/* Top bar — desktop & mobile */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
          isDark
            ? 'bg-navy/90 border-slate-800'
            : 'bg-warm-white/90 border-stone-200'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className={`font-heading font-bold text-lg ${isDark ? 'text-white' : 'text-navy'}`}>
              EasyStudy
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link to="/settings" aria-label="Settings">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=3b82f6&color=fff&size=32`}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-heading font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-stone-600 hover:text-navy hover:bg-stone-100'
                }`}
              >
                {isGuest ? 'Sign in' : 'Sign in'}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Bottom nav — mobile */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 border-t md:hidden ${
          isDark
            ? 'bg-navy/95 border-slate-800 backdrop-blur-lg'
            : 'bg-warm-white/95 border-stone-200 backdrop-blur-lg'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map(({ to, label, icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-accent'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[10px] font-heading font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
