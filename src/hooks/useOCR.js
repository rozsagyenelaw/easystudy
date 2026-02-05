import { useState, useCallback } from 'react'
import Tesseract from 'tesseract.js'

export function useOCR() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [confidence, setConfidence] = useState(null)
  const [error, setError] = useState(null)

  const processImage = useCallback(async (imageSource) => {
    setLoading(true)
    setError(null)
    setText('')
    setConfidence(null)

    try {
      // Use Tesseract.recognize for simpler API that handles worker internally
      const { data } = await Tesseract.recognize(imageSource, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            // Could add progress here if needed
          }
        },
      })

      setText(data.text.trim())
      setConfidence(data.confidence)

      if (data.confidence < 50 || !data.text.trim()) {
        setError('We had trouble reading this image. Please edit the text below or retype your question.')
      }
    } catch (err) {
      setError('Failed to process image. Please try again or type your question.')
      console.error('OCR error:', err)
    } finally {
      setLoading(false)
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
  }, [])

  return { text, loading, confidence, error, processImage, updateText, reset }
}
