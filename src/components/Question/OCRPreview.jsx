import { useTheme } from '../../hooks/useTheme'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function OCRPreview({
  text,
  loading,
  confidence,
  error,
  preview,
  isPDF,
  pdfPages,
  onTextChange,
  onConfirm,
  onCancel
}) {
  const { isDark } = useTheme()

  return (
    <div className="space-y-4">
      {/* Image preview (not for PDFs) */}
      {preview && !isPDF && (
        <div className="rounded-2xl overflow-hidden max-h-48">
          <img src={preview} alt="Uploaded question" className="w-full object-contain max-h-48" />
        </div>
      )}

      {/* PDF indicator */}
      {isPDF && !loading && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${isDark ? 'bg-navy-lighter' : 'bg-stone-100'}`}>
          <span className="text-3xl">📄</span>
          <div>
            <p className={`font-heading font-medium ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
              PDF Document
            </p>
            {pdfPages > 0 && (
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                {pdfPages} page{pdfPages > 1 ? 's' : ''} • Text extracted from first {Math.min(pdfPages, 5)} page{Math.min(pdfPages, 5) > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="py-4">
          <LoadingSpinner message={isPDF ? "Extracting text from PDF..." : "Reading text from image..."} />
        </div>
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
              ⚠️ {error}
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
              rows={8}
              className={`w-full rounded-2xl px-5 py-4 text-base resize-none transition-all outline-none font-body ${
                isDark
                  ? 'bg-navy-lighter border border-slate-600 text-warm-white focus:border-accent focus:ring-2 focus:ring-accent/20'
                  : 'bg-warm-gray border border-stone-300 text-navy focus:border-accent focus:ring-2 focus:ring-accent/20'
              }`}
              placeholder="No text was extracted. You can type your question here..."
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
