import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import SolutionView from '../components/Solution/SolutionView'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function SharedSolution() {
  const { isDark } = useTheme()
  const { shareId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'shared', shareId))
        if (!docSnap.exists()) {
          setError('This shared solution was not found or has expired.')
          return
        }
        const d = docSnap.data()
        // Check expiration
        if (d.expiresAt && new Date(d.expiresAt) < new Date()) {
          setError('This shared link has expired.')
          return
        }
        setData(d)
      } catch {
        setError('Failed to load shared solution.')
      } finally {
        setLoading(false)
      }
    }
    fetchShared()
  }, [shareId])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <LoadingSpinner message="Loading shared solution..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🔗</div>
        <p className={`font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
          {error}
        </p>
        <Link to="/" className="btn-primary inline-block mt-4">
          Go to EasyStudy
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      {/* Shared badge */}
      <div className={`rounded-xl p-3 mb-4 text-center text-sm font-heading ${
        isDark ? 'bg-accent/10 text-accent' : 'bg-blue-50 text-accent'
      }`}>
        🔗 Shared solution — <Link to="/" className="underline">Try EasyStudy yourself</Link>
      </div>

      {/* Question */}
      <div className={`rounded-2xl p-5 mb-6 ${isDark ? 'bg-navy-lighter' : 'bg-warm-gray'}`}>
        <p className={`text-xs font-heading font-bold uppercase tracking-wider mb-2 ${
          isDark ? 'text-slate-500' : 'text-stone-400'
        }`}>
          Question
        </p>
        <p className={`font-body text-base ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
          {data.question}
        </p>
      </div>

      <SolutionView
        solution={data.solution}
        questionId={shareId}
        bookmarked={false}
        onToggleBookmark={() => {}}
        expandedSteps={{}}
        onExplainFurther={() => {}}
      />

      <div className="mt-8 text-center">
        <Link to="/ask" className="btn-primary inline-block">
          Ask your own question ✨
        </Link>
      </div>
    </motion.div>
  )
}
