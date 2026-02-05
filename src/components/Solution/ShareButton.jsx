import { useState, useCallback } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useTheme } from '../../hooks/useTheme'

export default function ShareButton({ questionData }) {
  const { isDark } = useTheme()
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async () => {
    setSharing(true)
    try {
      const shareId = crypto.randomUUID().slice(0, 12)
      const shareData = {
        question: questionData.question,
        subject: questionData.subject,
        solution: questionData.solution,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }

      await setDoc(doc(db, 'shared', shareId), shareData)

      const url = `${window.location.origin}/shared/${shareId}`

      if (navigator.share) {
        await navigator.share({ title: 'EasyStudy Solution', url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      // Fallback: try clipboard only
      console.error('Share error:', err)
    } finally {
      setSharing(false)
    }
  }, [questionData])

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-medium transition-all ${
        copied
          ? 'bg-emerald/20 text-emerald'
          : sharing
          ? 'opacity-50 cursor-not-allowed'
          : isDark
          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
      }`}
      aria-label="Share solution"
    >
      {copied ? '✓ Link copied!' : sharing ? 'Sharing...' : '🔗 Share'}
    </button>
  )
}
