import { useRef, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useOCR } from '../../hooks/useOCR'
import OCRPreview from './OCRPreview'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function PhotoUpload({ onTextConfirmed }) {
  const { isDark } = useTheme()
  const { text, loading, confidence, error, processImage, updateText, reset } = useOCR()
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [fileError, setFileError] = useState('')

  const handleFile = (file) => {
    setFileError('')
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Please upload a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > MAX_SIZE) {
      setFileError('Image must be under 5MB.')
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)
    processImage(file)
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
  }

  const handleCancel = () => {
    reset()
    setPreview(null)
  }

  // Show OCR preview if we have extracted text
  if (text || loading) {
    return (
      <OCRPreview
        text={text}
        loading={loading}
        confidence={confidence}
        error={error}
        preview={preview}
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
          Upload a photo of your question
        </p>
        <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          Drag & drop or use the buttons below. JPG, PNG, or WebP, max 5MB.
        </p>

        <div className="flex gap-3 justify-center">
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
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
          aria-label="Upload image"
        />
      </div>

      {fileError && (
        <p className="text-red-400 text-sm font-heading" role="alert">{fileError}</p>
      )}
    </div>
  )
}
