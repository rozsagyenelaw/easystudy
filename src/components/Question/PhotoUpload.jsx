import { useRef, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useOCR } from '../../hooks/useOCR'
import OCRPreview from './OCRPreview'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB for PDFs
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_PDF_TYPES = ['application/pdf']
const ALL_ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_PDF_TYPES]

export default function PhotoUpload({ onTextConfirmed }) {
  const { isDark } = useTheme()
  const { text, loading, confidence, error, processImage, processPDF, updateText, reset } = useOCR()
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [fileError, setFileError] = useState('')
  const [isPDF, setIsPDF] = useState(false)
  const [pdfPages, setPdfPages] = useState(0)

  const handleFile = async (file) => {
    setFileError('')
    setIsPDF(false)
    setPdfPages(0)
    if (!file) return

    if (!ALL_ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Please upload a JPG, PNG, WebP image, or PDF file.')
      return
    }
    if (file.size > MAX_SIZE) {
      setFileError('File must be under 10MB.')
      return
    }

    if (ACCEPTED_PDF_TYPES.includes(file.type)) {
      // Handle PDF
      setIsPDF(true)
      setPreview(null) // No preview for PDFs
      const pageCount = await processPDF(file)
      if (pageCount) setPdfPages(pageCount)
    } else {
      // Handle image
      const url = URL.createObjectURL(file)
      setPreview(url)
      processImage(file)
    }
  }

  const handleFileInput = (e) => {
    handleFile(e.target.files?.[0])
  }

  const handleCamera = async () => {
    // On mobile, this opens the camera
    fileInputRef.current?.click()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleConfirm = () => {
    onTextConfirmed(text)
    reset()
    setPreview(null)
    setIsPDF(false)
    setPdfPages(0)
  }

  const handleCancel = () => {
    reset()
    setPreview(null)
    setIsPDF(false)
    setPdfPages(0)
  }

  // Show OCR preview if we have extracted text or are loading
  if (text || loading) {
    return (
      <OCRPreview
        text={text}
        loading={loading}
        confidence={confidence}
        error={error}
        preview={preview}
        isPDF={isPDF}
        pdfPages={pdfPages}
        onTextChange={updateText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          isDark
            ? 'border-slate-600 hover:border-accent bg-navy-lighter/50'
            : 'border-stone-300 hover:border-accent bg-stone-50'
        }`}
      >
        <div className="text-4xl mb-3">📷</div>
        <p className={`font-heading font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
          Upload a photo or PDF of your question
        </p>
        <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          Supports handwritten notes, textbook pages, PDFs. Max 10MB.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            type="button"
            onClick={handleCamera}
            className="btn-primary text-sm px-5 py-2.5"
          >
            📸 Take photo
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary text-sm px-5 py-2.5"
          >
            📁 Choose file
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
          aria-label="Upload image or PDF"
        />
      </div>

      {fileError && (
        <p className="text-red-400 text-sm font-heading" role="alert">{fileError}</p>
      )}

      {/* Tips */}
      <div className={`rounded-xl p-4 text-sm ${isDark ? 'bg-navy-lighter' : 'bg-stone-100'}`}>
        <p className={`font-heading font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
          📝 Tips for best results:
        </p>
        <ul className={`space-y-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          <li>• Use good lighting for handwritten notes</li>
          <li>• Keep the camera steady and text in focus</li>
          <li>• For PDFs, text-based PDFs work best</li>
          <li>• You can edit the extracted text before submitting</li>
        </ul>
      </div>
    </div>
  )
}
