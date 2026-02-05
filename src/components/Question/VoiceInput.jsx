import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import { useVoiceInput } from '../../hooks/useVoiceInput'

export default function VoiceInput({ onTextConfirmed }) {
  const { isDark } = useTheme()
  const { transcript, isListening, isSupported, error, startListening, stopListening, reset, setTranscript } = useVoiceInput()

  if (!isSupported) {
    return (
      <div className={`rounded-2xl p-6 text-center ${isDark ? 'bg-navy-lighter' : 'bg-stone-50'}`}>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          Voice input is not supported in this browser. Try Chrome or Edge.
        </p>
      </div>
    )
  }

  const handleConfirm = () => {
    onTextConfirmed(transcript)
    reset()
  }

  return (
    <div className="space-y-4">
      {/* Mic button */}
      <div className="text-center py-4">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${
            isListening
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : isDark
              ? 'bg-accent text-white shadow-lg shadow-accent/30'
              : 'bg-accent text-white shadow-lg shadow-accent/30'
          }`}
          aria-label={isListening ? 'Stop recording' : 'Start recording'}
        >
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          {isListening ? '⏹' : '🎤'}
        </button>
        <p className={`mt-3 text-sm font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          {isListening ? 'Listening... tap to stop' : 'Tap to start speaking'}
        </p>
      </div>

      {/* Note about math */}
      <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
        💡 For math equations, typing or photo may work better
      </p>

      {/* Transcript */}
      {transcript && (
        <div>
          <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            Transcription — edit if needed
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={4}
            className={`w-full rounded-2xl px-5 py-4 text-base resize-none transition-all outline-none font-body ${
              isDark
                ? 'bg-navy-lighter border border-slate-600 text-warm-white focus:border-accent'
                : 'bg-warm-gray border border-stone-300 text-navy focus:border-accent'
            }`}
          />
          <div className="flex gap-3 mt-3">
            <button type="button" onClick={handleConfirm} className="btn-primary flex-1">
              Use this text ✓
            </button>
            <button type="button" onClick={reset} className="btn-secondary flex-1">
              Clear
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm font-heading text-center" role="alert">{error}</p>
      )}
    </div>
  )
}
