import { useState, useCallback } from 'react'
import { solveQuestion } from '../utils/apiClient'

export function useQuestionSolver() {
  const [solution, setSolution] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedSteps, setExpandedSteps] = useState({})

  const solve = useCallback(async ({ question, subject, depth }) => {
    setLoading(true)
    setError(null)
    setSolution(null)
    setExpandedSteps({})

    try {
      const data = await solveQuestion({ question, subject, depth })
      setSolution(data)
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const explainStep = useCallback(async (stepIndex, question, subject) => {
    setExpandedSteps(prev => ({ ...prev, [stepIndex]: { loading: true } }))

    try {
      const data = await solveQuestion({
        question,
        subject,
        depth: 'deep',
        followUpStepIndex: stepIndex,
      })
      setExpandedSteps(prev => ({
        ...prev,
        [stepIndex]: { loading: false, explanation: data },
      }))
    } catch (err) {
      setExpandedSteps(prev => ({
        ...prev,
        [stepIndex]: { loading: false, error: err.message },
      }))
    }
  }, [])

  const reset = useCallback(() => {
    setSolution(null)
    setLoading(false)
    setError(null)
    setExpandedSteps({})
  }, [])

  return { solution, loading, error, expandedSteps, solve, explainStep, reset }
}
