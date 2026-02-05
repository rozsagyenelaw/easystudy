import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { detectSubject } from '../../utils/subjectDetector'
import SubjectSelector from './SubjectSelector'
import PhotoUpload from './PhotoUpload'
import VoiceInput from './VoiceInput'

const MAX_CHARS = 2000

const DEPTH_OPTIONS = [
  { value: 'basic', label: 'Basic', desc: 'Quick overview' },
  { value: 'standard', label: 'Standard', desc: 'Clear steps' },
  { value: 'deep', label: 'Deep', desc: 'Full detail' },
]

const INPUT_MODES = [
  { id: 'type', label: 'Type', icon: '⌨️' },
  { id: 'photo', label: 'Photo', icon: '📷' },
  { id: 'voice', label: 'Voice', icon: '🎤' },
]

export default function QuestionInput({ onSubmit, loading }) {
  const { isDark } = useTheme()
  const [inputMode, setInputMode] = useState('type')
  const [question, setQuestion] = useState('')
  const [subject, setSubject] = useState(null)
  const [depth, setDepth] = useState(
    () => localStorage.getItem('easystudy-default-depth') || 'standard'
  )
  const [error, setError] = useState('')

  useEffect(() => {
    if (question.length > 20) {
      const detected = detectSubject(question)
      if (detected && !subject) {
        setSubject(detected)
      }
    }
  }, [question, subject])

  const handleTextFromOCRorVoice = (text) => {
    setQuestion(text)
    setInputMode('type')
    // Auto-detect subject
    const detected = detectSubject(text)
    if (detected) setSubject(detected)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = question.trim()
    if (!trimmed) {
      setError('Please type a question first.')
      return
    }
    if (trimmed.length < 10) {
      setError('Please provide more detail — at least 10 characters.')
      return
    }
    setError('')
    onSubmit({ question: trimmed, subject: subject || 'Other', depth })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Input mode tabs */}
      <div className={`inline-flex rounded-xl p-1 ${isDark ? 'bg-navy-lighter' : 'bg-stone-100'}`}>
        {INPUT_MODES.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setInputMode(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-heading font-medium transition-all duration-200 ${
              inputMode === id
                ? 'bg-accent text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Type mode */}
      {inputMode === 'type' && (
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setQuestion(e.target.value)
                setError('')
              }
            }}
            placeholder="Type or paste your question here..."
            rows={5}
            className={`w-full rounded-2xl px-5 py-4 text-base resize-none transition-all duration-200 outline-none font-body ${
              isDark
                ? 'bg-navy-lighter border border-slate-600 text-warm-white placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
                : 'bg-warm-gray border border-stone-300 text-navy placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent/20'
            }`}
            aria-label="Your question"
            aria-describedby="char-count"
            disabled={loading}
          />
          <span
            id="char-count"
            className={`absolute bottom-3 right-4 text-xs font-heading ${
              question.length > MAX_CHARS * 0.9
                ? 'text-red-400'
                : isDark ? 'text-slate-500' : 'text-stone-400'
            }`}
          >
            {question.length}/{MAX_CHARS}
          </span>
        </div>
      )}

      {/* Photo mode */}
      {inputMode === 'photo' && (
        <PhotoUpload onTextConfirmed={handleTextFromOCRorVoice} />
      )}

      {/* Voice mode */}
      {inputMode === 'voice' && (
        <VoiceInput onTextConfirmed={handleTextFromOCRorVoice} />
      )}

      {error && (
        <p className="text-red-400 text-sm font-heading" role="alert">{error}</p>
      )}

      {/* Subject chips */}
      <div>
        <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
          Subject
        </label>
        <SubjectSelector selected={subject} onSelect={setSubject} />
      </div>

      {/* Depth toggle */}
      <div>
        <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
          Explanation depth
        </label>
        <div className={`inline-flex rounded-xl p-1 ${isDark ? 'bg-navy-lighter' : 'bg-stone-100'}`}>
          {DEPTH_OPTIONS.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setDepth(value)}
              className={`px-4 py-2 rounded-lg text-sm font-heading font-medium transition-all duration-200 ${
                depth === value
                  ? 'bg-accent text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
              title={desc}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !question.trim()}
        className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Solving...
          </>
        ) : (
          <>Solve ✨</>
        )}
      </button>
    </form>
  )
}
