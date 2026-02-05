import { useState, useCallback, useRef } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

const API_BASE = '/.netlify/functions'

export function usePracticeMode() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [revealedSolutions, setRevealedSolutions] = useState({})
  const [revealedHints, setRevealedHints] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timePerQuestion, setTimePerQuestion] = useState(120)
  const startTimeRef = useRef(null)
  const [totalTime, setTotalTime] = useState(0)

  const generateQuestions = useCallback(async ({ subject, topic, difficulty, count }) => {
    setLoading(true)
    setError(null)
    setQuestions([])
    setCurrentIndex(0)
    setAnswers({})
    setRevealedSolutions({})
    setRevealedHints({})
    setSessionComplete(false)

    try {
      const response = await fetch(`${API_BASE}/generate-practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, difficulty, count }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to generate practice questions.')
      }

      const data = await response.json()
      setQuestions(data.questions || [])
      startTimeRef.current = Date.now()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const setAnswer = useCallback((questionIndex, answer) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }))
  }, [])

  const revealHint = useCallback((questionIndex) => {
    setRevealedHints(prev => {
      const current = prev[questionIndex] || 0
      return { ...prev, [questionIndex]: current + 1 }
    })
  }, [])

  const revealSolution = useCallback((questionIndex) => {
    setRevealedSolutions(prev => ({ ...prev, [questionIndex]: true }))
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex, questions.length])

  const previousQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  const finishSession = useCallback(async () => {
    const elapsed = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0
    setTotalTime(elapsed)
    setSessionComplete(true)

    // Save to Firestore if logged in
    if (user && questions.length > 0) {
      try {
        const attempted = Object.keys(answers).length
        const solutionsViewed = Object.keys(revealedSolutions).length
        await addDoc(collection(db, 'users', user.uid, 'practice'), {
          subject: questions[0]?.subject,
          topic: questions[0]?.topic,
          difficulty: questions[0]?.difficulty,
          questionCount: questions.length,
          attempted,
          solutionsViewed,
          totalTime: elapsed,
          timestamp: serverTimestamp(),
        })
      } catch { /* ignore */ }
    }
  }, [user, questions, answers, revealedSolutions])

  const reset = useCallback(() => {
    setQuestions([])
    setCurrentIndex(0)
    setAnswers({})
    setRevealedSolutions({})
    setRevealedHints({})
    setSessionComplete(false)
    setError(null)
    setTotalTime(0)
    startTimeRef.current = null
  }, [])

  return {
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex] || null,
    answers,
    revealedSolutions,
    revealedHints,
    loading,
    error,
    sessionComplete,
    timerEnabled,
    timePerQuestion,
    totalTime,
    setTimerEnabled,
    setTimePerQuestion,
    generateQuestions,
    setAnswer,
    revealHint,
    revealSolution,
    nextQuestion,
    previousQuestion,
    finishSession,
    reset,
  }
}
