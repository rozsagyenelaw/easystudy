import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import { SUBJECTS } from '../../utils/subjectDetector'

const TEMPLATES = [
  { label: 'Study daily', template: (s) => `Study ${s} for {minutes} minutes daily` },
  { label: 'Master a topic', template: (s) => `Master ${s} in {days} days` },
  { label: 'Exam prep', template: (s) => `Prepare for ${s} exam on {date}` },
]

export default function GoalSetter({ onGenerate, generating }) {
  const { isDark } = useTheme()
  const [subject, setSubject] = useState('')
  const [goal, setGoal] = useState('')
  const [dailyMinutes, setDailyMinutes] = useState(20)
  const [examDate, setExamDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!goal.trim() || !subject) return

    onGenerate({
      goal: goal.trim(),
      subjects: [subject],
      dailyMinutes,
      examDate: examDate || null,
    })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Subject selection */}
      <div>
        <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
          Subject
        </label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className={`px-3 py-1.5 rounded-xl text-sm font-heading font-medium transition-colors ${
                subject === s
                  ? 'bg-accent text-white'
                  : isDark
                  ? 'bg-navy-lighter text-slate-300 hover:bg-slate-600'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Goal templates */}
      {subject && (
        <div>
          <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            Quick templates
          </label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map(({ label, template }) => (
              <button
                key={label}
                type="button"
                onClick={() => setGoal(template(subject))}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading transition-colors ${
                  isDark
                    ? 'bg-navy-lighter text-slate-300 hover:bg-slate-600'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom goal */}
      <div>
        <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
          Your goal
        </label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Master Algebra in 30 days"
          className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors ${
            isDark
              ? 'bg-navy-lighter border-slate-600 text-white placeholder-slate-500 focus:border-accent'
              : 'bg-white border-stone-300 text-stone-800 placeholder-stone-400 focus:border-accent'
          }`}
        />
      </div>

      {/* Daily minutes */}
      <div>
        <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
          Daily study time: {dailyMinutes} min
        </label>
        <input
          type="range"
          min="10"
          max="120"
          step="5"
          value={dailyMinutes}
          onChange={(e) => setDailyMinutes(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="flex justify-between mt-1">
          <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>10 min</span>
          <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>120 min</span>
        </div>
      </div>

      {/* Exam date (optional) */}
      <div>
        <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
          Exam date (optional)
        </label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors ${
            isDark
              ? 'bg-navy-lighter border-slate-600 text-white focus:border-accent'
              : 'bg-white border-stone-300 text-stone-800 focus:border-accent'
          }`}
        />
      </div>

      <button
        type="submit"
        disabled={!goal.trim() || !subject || generating}
        className="btn-primary w-full disabled:opacity-50"
      >
        {generating ? 'Generating plan...' : 'Generate Study Plan ✨'}
      </button>
    </motion.form>
  )
}
