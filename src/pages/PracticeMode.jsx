import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { usePracticeMode } from '../hooks/usePracticeMode'
import SubjectSelector from '../components/Question/SubjectSelector'
import DifficultySelector from '../components/Practice/DifficultySelector'
import PracticeSession from '../components/Practice/PracticeSession'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import ErrorMessage from '../components/Common/ErrorMessage'

const COUNT_OPTIONS = [5, 10, 15]

export default function PracticeMode() {
  const { isDark } = useTheme()
  const practice = usePracticeMode()
  const [subject, setSubject] = useState(null)
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [count, setCount] = useState(5)

  const handleStart = () => {
    if (!subject) return
    practice.generateQuestions({ subject, topic: topic || undefined, difficulty, count })
  }

  // Active practice session
  if (practice.questions.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 py-8 pb-24"
      >
        <PracticeSession {...practice} />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      <h1 className={`font-heading font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-navy'}`}>
        Practice Mode
      </h1>
      <p className={`text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
        Generate practice questions to test your understanding
      </p>

      <div className="space-y-6">
        {/* Subject */}
        <div>
          <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            Subject *
          </label>
          <SubjectSelector selected={subject} onSelect={setSubject} />
        </div>

        {/* Topic */}
        <div>
          <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            Topic (optional — be specific for better questions)
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Quadratic equations, Newton's laws, Organic chemistry..."
            className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all font-body ${
              isDark
                ? 'bg-navy-lighter border border-slate-600 text-white placeholder:text-slate-500 focus:border-accent'
                : 'bg-warm-gray border border-stone-300 text-navy placeholder:text-stone-400 focus:border-accent'
            }`}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            Difficulty
          </label>
          <DifficultySelector selected={difficulty} onSelect={setDifficulty} />
        </div>

        {/* Count */}
        <div>
          <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            Number of questions
          </label>
          <div className={`inline-flex rounded-xl p-1 ${isDark ? 'bg-navy-lighter' : 'bg-stone-100'}`}>
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`px-5 py-2 rounded-lg text-sm font-heading font-medium transition-all ${
                  count === n
                    ? 'bg-accent text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Timer toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-heading font-medium ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
              Timed mode
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
              {practice.timePerQuestion / 60} min per question
            </p>
          </div>
          <button
            type="button"
            onClick={() => practice.setTimerEnabled(!practice.timerEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              practice.timerEnabled
                ? 'bg-accent'
                : isDark ? 'bg-slate-600' : 'bg-stone-300'
            }`}
            role="switch"
            aria-checked={practice.timerEnabled}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                practice.timerEnabled ? 'left-[1.625rem]' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Start */}
        <button
          onClick={handleStart}
          disabled={!subject || practice.loading}
          className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {practice.loading ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating questions...
            </>
          ) : (
            'Start practicing 🎯'
          )}
        </button>

        {practice.error && (
          <ErrorMessage message={practice.error} onRetry={handleStart} />
        )}
      </div>
    </motion.div>
  )
}
