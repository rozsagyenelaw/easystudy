import { useTheme } from '../../hooks/useTheme'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function OCRPreview({ text, loading, confidence, error, preview, onTextChange, onConfirm, onCancel }) {
  const { isDark } = useTheme()

  return (
    <div className="space-y-4">
      {/* Image preview */}
      {preview && (
        <div className="rounded-2xl overflow-hidden max-h-48">
          <img src={preview} alt="Uploaded question" className="w-full object-contain max-h-48" />
        </div>
      )}

      {loading && (
        <LoadingSpinner message="Reading text from image..." />
      )}

      {!loading && (
        <>
          {/* Confidence indicator */}
          {confidence !== null && (
            <div className="flex items-center gap-2">
              <div className={`h-2 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`}>
                <div
                  className={`h-full rounded-full transition-all ${
                    confidence >= 70 ? 'bg-emerald' : confidence >= 50 ? 'bg-amber-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className={`text-xs font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                {Math.round(confidence)}% confidence
              </span>
            </div>
          )}

          {/* Error/warning */}
          {error && (
            <p className={`text-sm font-heading ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              {error}
            </p>
          )}

          {/* Editable text */}
          <div>
            <label className={`block text-sm font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
              Extracted text — edit if needed
            </label>
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              rows={5}
              className={`w-full rounded-2xl px-5 py-4 text-base resize-none transition-all outline-none font-body ${
                isDark
                  ? 'bg-navy-lighter border border-slate-600 text-warm-white focus:border-accent focus:ring-2 focus:ring-accent/20'
                  : 'bg-warm-gray border border-stone-300 text-navy focus:border-accent focus:ring-2 focus:ring-accent/20'
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={!text.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Use this text ✓
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Try again
            </button>
          </div>
        </>
      )}
    </div>
  )
}
