import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import MathRenderer from '../Common/MathRenderer'

export default function PracticeResults({
  questions,
  answers,
  revealedSolutions,
  totalTime,
  onPracticeAgain,
  onReviewQuestion,
}) {
  const { isDark } = useTheme()

  const totalQuestions = questions.length
  const attempted = Object.keys(answers).filter(k => answers[k]?.trim()).length
  const solutionsViewed = Object.keys(revealedSolutions).length
  const completionRate = Math.round((attempted / totalQuestions) * 100)

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score card */}
      <div className={`rounded-3xl p-8 text-center ${
        isDark ? 'bg-navy-light border border-slate-700' : 'bg-white border border-stone-200 shadow-sm'
      }`}>
        <div className="text-5xl mb-3">🎯</div>
        <h2 className={`font-heading font-bold text-2xl mb-1 ${isDark ? 'text-white' : 'text-navy'}`}>
          Practice Complete!
        </h2>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          Here's how you did
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <p className={`text-2xl font-heading font-bold ${isDark ? 'text-accent' : 'text-accent'}`}>
              {attempted}/{totalQuestions}
            </p>
            <p className={`text-xs font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              Attempted
            </p>
          </div>
          <div>
            <p className={`text-2xl font-heading font-bold ${isDark ? 'text-emerald' : 'text-emerald'}`}>
              {completionRate}%
            </p>
            <p className={`text-xs font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              Completion
            </p>
          </div>
          <div>
            <p className={`text-2xl font-heading font-bold ${isDark ? 'text-amber-400' : 'text-amber-500'}`}>
              {formatTime(totalTime)}
            </p>
            <p className={`text-xs font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              Time
            </p>
          </div>
        </div>

        {solutionsViewed > 0 && (
          <p className={`text-xs mt-4 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
            Solutions viewed: {solutionsViewed} of {totalQuestions}
          </p>
        )}
      </div>

      {/* Question review list */}
      <div>
        <h3 className={`font-heading font-semibold text-base mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
          Review Questions
        </h3>
        <div className="space-y-2">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => onReviewQuestion(i)}
              className={`w-full text-left rounded-xl p-4 transition-colors ${
                isDark
                  ? 'bg-navy-lighter hover:bg-slate-700 border border-slate-700'
                  : 'bg-stone-50 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-heading font-medium ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
                  Q{i + 1}
                </span>
                <div className="flex items-center gap-2">
                  {answers[i]?.trim() && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald/20 text-emerald font-heading">
                      Answered
                    </span>
                  )}
                  {revealedSolutions[i] && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-heading">
                      Solution viewed
                    </span>
                  )}
                </div>
              </div>
              <p className={`text-sm mt-1 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                <MathRenderer text={q.question_text} />
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onPracticeAgain} className="btn-primary flex-1">
          Practice again 🔄
        </button>
      </div>
    </motion.div>
  )
}
