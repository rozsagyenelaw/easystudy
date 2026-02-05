import { useState, useCallback } from 'react'
import Tesseract from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export function useOCR() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [confidence, setConfidence] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  // Process image with enhanced settings for handwriting
  const processImage = useCallback(async (imageSource) => {
    setLoading(true)
    setError(null)
    setText('')
    setConfidence(null)
    setProgress(0)

    try {
      const { data } = await Tesseract.recognize(imageSource, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        },
        // Tesseract parameters optimized for handwriting
        tessedit_pageseg_mode: '6', // Assume uniform block of text
        preserve_interword_spaces: '1',
      })

      const extractedText = data.text.trim()
      setText(extractedText)
      setConfidence(data.confidence)

      if (data.confidence < 40 || !extractedText) {
        setError('We had trouble reading this image. The text may be unclear or handwritten. Please edit below or retype your question.')
      } else if (data.confidence < 70) {
        setError('Some parts may not be accurate. Please review and edit the text below.')
      }
    } catch (err) {
      setError('Failed to process image. Please try again or type your question.')
      console.error('OCR error:', err)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }, [])

  // Process PDF by extracting text directly (faster) or via OCR for scanned PDFs
  const processPDF = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    setText('')
    setConfidence(null)
    setProgress(0)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages

      let allText = ''
      let hasTextContent = false

      // First, try to extract embedded text (for text-based PDFs)
      for (let i = 1; i <= Math.min(numPages, 5); i++) { // Limit to first 5 pages
        setProgress(Math.round((i / Math.min(numPages, 5)) * 50))
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')

        if (pageText.trim().length > 20) {
          hasTextContent = true
          allText += (i > 1 ? '\n\n--- Page ' + i + ' ---\n\n' : '') + pageText
        }
      }

      // If we found text content, use it
      if (hasTextContent && allText.trim().length > 50) {
        setText(allText.trim())
        setConfidence(95) // High confidence for extracted text
        return numPages
      }

      // Otherwise, OCR the first page (scanned PDF)
      setProgress(50)
      const page = await pdf.getPage(1)
      const scale = 2.0 // Higher resolution for better OCR
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      await page.render({ canvasContext: context, viewport }).promise

      // Convert canvas to blob for Tesseract
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))

      setProgress(60)

      const { data } = await Tesseract.recognize(blob, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(60 + Math.round(m.progress * 40))
          }
        },
      })

      setText(data.text.trim())
      setConfidence(data.confidence)

      if (data.confidence < 50 || !data.text.trim()) {
        setError('This appears to be a scanned PDF with unclear text. Please review and edit below.')
      }

      return numPages
    } catch (err) {
      setError('Failed to process PDF. The file may be corrupted or password-protected.')
      console.error('PDF processing error:', err)
      return 0
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }, [])

  const updateText = useCallback((newText) => {
    setText(newText)
  }, [])

  const reset = useCallback(() => {
    setText('')
    setConfidence(null)
    setError(null)
    setLoading(false)
    setProgress(0)
  }, [])

  return {
    text,
    loading,
    confidence,
    error,
    progress,
    processImage,
    processPDF,
    updateText,
    reset
  }
}
