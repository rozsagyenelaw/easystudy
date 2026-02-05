import { useState, useCallback } from 'react'

const LOCAL_KEY = 'easystudy-onboarding'
const PREFS_KEY = 'easystudy-user-prefs'

function getOnboardingState() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || { completed: false, step: 0 }
  } catch {
    return { completed: false, step: 0 }
  }
}

function getUserPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}
  } catch {
    return {}
  }
}

export function useOnboarding() {
  const [state, setState] = useState(getOnboardingState)
  const [prefs, setPrefs] = useState(getUserPrefs)

  const setStep = useCallback((step) => {
    setState(prev => {
      const updated = { ...prev, step }
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const completeOnboarding = useCallback(() => {
    const updated = { completed: true, step: -1 }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
    setState(updated)
  }, [])

  const resetOnboarding = useCallback(() => {
    const updated = { completed: false, step: 0 }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
    setState(updated)
  }, [])

  const updatePrefs = useCallback((updates) => {
    setPrefs(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(PREFS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const shouldShowOnboarding = !state.completed

  return {
    step: state.step,
    completed: state.completed,
    prefs,
    shouldShowOnboarding,
    setStep,
    completeOnboarding,
    resetOnboarding,
    updatePrefs,
  }
}
