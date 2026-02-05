import { useState, useCallback, useEffect, useSyncExternalStore } from 'react'

const LOCAL_KEY = 'easystudy-onboarding'
const PREFS_KEY = 'easystudy-user-prefs'

// Shared listeners for cross-component sync
let listeners = []

function emitChange() {
  listeners.forEach(listener => listener())
}

function subscribe(listener) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter(l => l !== listener)
  }
}

function getOnboardingSnapshot() {
  try {
    const data = localStorage.getItem(LOCAL_KEY)
    return data || JSON.stringify({ completed: false, step: 0 })
  } catch {
    return JSON.stringify({ completed: false, step: 0 })
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
  // Use useSyncExternalStore for cross-component reactivity
  const stateJson = useSyncExternalStore(subscribe, getOnboardingSnapshot, getOnboardingSnapshot)
  const state = JSON.parse(stateJson)

  const [prefs, setPrefs] = useState(getUserPrefs)

  const setStep = useCallback((step) => {
    const current = JSON.parse(getOnboardingSnapshot())
    const updated = { ...current, step }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
    emitChange()
  }, [])

  const completeOnboarding = useCallback(() => {
    const updated = { completed: true, step: -1 }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
    emitChange()
  }, [])

  const resetOnboarding = useCallback(() => {
    const updated = { completed: false, step: 0 }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
    emitChange()
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
