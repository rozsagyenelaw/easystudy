import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useQuestionSolver } from '../hooks/useQuestionSolver'
import { useQuestionHistory } from '../hooks/useQuestionHistory'
import { useProgress } from '../hooks/useProgress'
import { useStreaks } from '../hooks/useStreaks'
import { useAchievements } from '../hooks/useAchievements'
import QuestionInput from '../components/Question/QuestionInput'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import ErrorMessage from '../components/Common/ErrorMessage'

const LOADING_MESSAGES = [
  'Analyzing your question...',
  'Breaking it down step by step...',
  'Crafting a clear explanation...',
  'Almost there...',
]

export default function AskQuestion() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { solve, loading, error, reset } = useQuestionSolver()
  const { addQuestion, history } = useQuestionHistory()
  const { recordQuestion, stats } = useProgress()
  const { recordActivity, streaks } = useStreaks()
  const { checkAchievements } = useAchievements()

  const handleSubmit = async ({ question, subject, depth, mode }) => {
    const solution = await solve({ question, subject, depth, mode })
    if (solution) {
      const id = await addQuestion({ question, subject, solution, mode: mode || 'full' })

      // Track progress
      const detectedSubject = solution.subject_detected || subject || 'General'
      const detectedTopic = solution.topic || 'General'
      recordQuestion(detectedSubject, detectedTopic, true, solution.difficulty || 'medium')

      // Track streak activity
      recordActivity({ minutesStudied: 2, questionsAnswered: 1 })

      // Check achievements
      checkAchievements({
        totalQuestions: (stats.totalQuestions || 0) + 1,
        subjectsStudied: stats.subjectsStudied || 0,
        currentStreak: streaks.currentStreak || 0,
        practiceSessions: 0,
        hasSubjectExpert: false,
      })

      if (id) {
        navigate(`/solution/${id}`)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      <h1 className={`font-heading font-bold text-2xl mb-6 ${isDark ? 'text-white' : 'text-navy'}`}>
        What do you need help with?
      </h1>

      {!loading && <QuestionInput onSubmit={handleSubmit} loading={loading} />}

      {loading && (
        <div className="mt-8">
          <LoadingSpinner
            message={LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]}
            size="lg"
          />
        </div>
      )}

      {error && (
        <div className="mt-6">
          <ErrorMessage message={error} onRetry={reset} />
        </div>
      )}
    </motion.div>
  )
}
