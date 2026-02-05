import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

export default function FeedbackButton({ questionId }) {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const [submitted, setSubmitted] = useState(null)

  const handleFeedback = async (helpful) => {
    setSubmitted(helpful)

    if (user) {
      try {
        await addDoc(collection(db, 'users', user.uid, 'feedback'), {
          questionId,
          helpful,
          timestamp: serverTimestamp(),
        })
      } catch { /* ignore */ }
    }
  }

  if (submitted !== null) {
    return (
      <p className={`text-sm font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
        {submitted ? 'Glad it helped! 🎉' : 'Thanks for the feedback. We\'ll improve!'}
      </p>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
        Did this help?
      </span>
      <button
        onClick={() => handleFeedback(true)}
        className={`text-lg px-2 py-1 rounded-lg transition-colors ${
          isDark ? 'hover:bg-emerald/10' : 'hover:bg-green-50'
        }`}
        aria-label="Yes, this helped"
      >
        👍
      </button>
      <button
        onClick={() => handleFeedback(false)}
        className={`text-lg px-2 py-1 rounded-lg transition-colors ${
          isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
        }`}
        aria-label="No, this didn't help"
      >
        👎
      </button>
    </div>
  )
}
