import { useTheme } from '../../hooks/useTheme'
import { useExportPDF } from '../../hooks/useExportPDF'

export default function ExportPDFButton({ elementId, filename }) {
  const { isDark } = useTheme()
  const { exportPDF, exporting } = useExportPDF()

  return (
    <button
      onClick={() => exportPDF(elementId, filename)}
      disabled={exporting}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-medium transition-all ${
        exporting
          ? 'opacity-50 cursor-not-allowed'
          : isDark
          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
      }`}
      aria-label="Export as PDF"
    >
      {exporting ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          Exporting...
        </>
      ) : (
        <>📄 Export PDF</>
      )}
    </button>
  )
}
