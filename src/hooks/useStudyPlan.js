import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

const LOCAL_KEY = 'easystudy-study-plan'
const API_BASE = '/.netlify/functions'

function getLocalPlan() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || null
  } catch {
    return null
  }
}

function setLocalPlan(plan) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(plan))
}

export function useStudyPlan() {
  const { user } = useAuth()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const fetchPlan = useCallback(async () => {
    setLoading(true)
    if (user) {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'studyPlan', 'current'))
        if (snap.exists()) {
          setPlan(snap.data())
        } else {
          setPlan(null)
        }
      } catch {
        setPlan(null)
      }
    } else {
      setPlan(getLocalPlan())
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchPlan()
  }, [fetchPlan])

  const generatePlan = useCallback(async ({ goal, subjects, currentProgress, examDate, dailyMinutes }) => {
    setGenerating(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/generate-study-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, subjects, currentProgress, examDate, dailyMinutes }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to generate study plan.')
      }

      const data = await response.json()

      const newPlan = {
        goal,
        examDate: examDate || null,
        dailyMinutes,
        subjects,
        generatedPlan: data.days || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (user) {
        await setDoc(doc(db, 'users', user.uid, 'studyPlan', 'current'), {
          ...newPlan,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      } else {
        setLocalPlan(newPlan)
      }

      setPlan(newPlan)
      return newPlan
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setGenerating(false)
    }
  }, [user])

  const toggleDayTask = useCallback(async (dayIndex, taskIndex) => {
    setPlan(prev => {
      if (!prev?.generatedPlan?.[dayIndex]) return prev

      const updated = { ...prev }
      const days = [...updated.generatedPlan]
      const day = { ...days[dayIndex] }
      const activities = [...(day.activities || [])]

      if (typeof activities[taskIndex] === 'string') {
        activities[taskIndex] = { text: activities[taskIndex], completed: true }
      } else {
        activities[taskIndex] = { ...activities[taskIndex], completed: !activities[taskIndex].completed }
      }

      day.activities = activities
      day.completed = activities.every(a => typeof a === 'object' && a.completed)
      days[dayIndex] = day
      updated.generatedPlan = days
      updated.updatedAt = new Date().toISOString()

      if (user) {
        setDoc(doc(db, 'users', user.uid, 'studyPlan', 'current'), updated, { merge: true }).catch(() => {})
      } else {
        setLocalPlan(updated)
      }

      return updated
    })
  }, [user])

  const clearPlan = useCallback(async () => {
    if (user) {
      try {
        const { deleteDoc: delDoc } = await import('firebase/firestore')
        await delDoc(doc(db, 'users', user.uid, 'studyPlan', 'current'))
      } catch { /* ignore */ }
    } else {
      localStorage.removeItem(LOCAL_KEY)
    }
    setPlan(null)
  }, [user])

  // Get today's plan
  const today = new Date().toISOString().split('T')[0]
  const todayPlan = plan?.generatedPlan?.find(d => d.date === today) || null
  const completedDays = plan?.generatedPlan?.filter(d => d.completed)?.length || 0
  const totalDays = plan?.generatedPlan?.length || 0

  return {
    plan,
    loading,
    generating,
    error,
    todayPlan,
    completedDays,
    totalDays,
    generatePlan,
    toggleDayTask,
    clearPlan,
    refetch: fetchPlan,
  }
}
