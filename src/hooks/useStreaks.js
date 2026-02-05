import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

const LOCAL_KEY = 'easystudy-streaks'

function getDateString(date = new Date()) {
  return date.toISOString().split('T')[0]
}

function getLocalStreaks() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || getDefaultStreaks()
  } catch {
    return getDefaultStreaks()
  }
}

function setLocalStreaks(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

function getDefaultStreaks() {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    studyDays: {},
    streakFreezeUsedThisWeek: false,
    dailyGoalMinutes: 20,
  }
}

function daysBetween(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return Math.round((d2 - d1) / (24 * 60 * 60 * 1000))
}

export function useStreaks() {
  const { user } = useAuth()
  const [streaks, setStreaks] = useState(getDefaultStreaks())
  const [loading, setLoading] = useState(true)

  const fetchStreaks = useCallback(async () => {
    setLoading(true)
    if (user) {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'streaks', 'current'))
        if (snap.exists()) {
          setStreaks(snap.data())
        } else {
          setStreaks(getDefaultStreaks())
        }
      } catch {
        setStreaks(getDefaultStreaks())
      }
    } else {
      setStreaks(getLocalStreaks())
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchStreaks()
  }, [fetchStreaks])

  const saveStreaks = useCallback((data) => {
    if (user) {
      setDoc(doc(db, 'users', user.uid, 'streaks', 'current'), data, { merge: true }).catch(() => {})
    } else {
      setLocalStreaks(data)
    }
  }, [user])

  const recordActivity = useCallback(({ minutesStudied = 0, questionsAnswered = 0 } = {}) => {
    setStreaks(prev => {
      const today = getDateString()
      const existing = prev.studyDays[today] || { minutesStudied: 0, questionsAnswered: 0 }

      const updated = {
        ...prev,
        studyDays: {
          ...prev.studyDays,
          [today]: {
            minutesStudied: existing.minutesStudied + minutesStudied,
            questionsAnswered: existing.questionsAnswered + questionsAnswered,
          },
        },
      }

      // Update streak
      const gap = prev.lastActiveDate ? daysBetween(prev.lastActiveDate, today) : -1

      if (gap <= 0 && prev.lastActiveDate === today) {
        // Same day, no streak change
      } else if (gap === 1 || !prev.lastActiveDate) {
        // Consecutive day or first day
        updated.currentStreak = (prev.currentStreak || 0) + 1
      } else if (gap === 2 && !prev.streakFreezeUsedThisWeek) {
        // Streak freeze: missed one day
        updated.currentStreak = (prev.currentStreak || 0) + 1
        updated.streakFreezeUsedThisWeek = true
      } else if (gap > 1) {
        // Streak broken
        updated.currentStreak = 1
      }

      updated.lastActiveDate = today
      updated.longestStreak = Math.max(updated.longestStreak || 0, updated.currentStreak)

      // Reset weekly freeze on Monday
      const dayOfWeek = new Date().getDay()
      if (dayOfWeek === 1) {
        updated.streakFreezeUsedThisWeek = false
      }

      saveStreaks(updated)
      return updated
    })
  }, [saveStreaks])

  const setDailyGoal = useCallback((minutes) => {
    setStreaks(prev => {
      const updated = { ...prev, dailyGoalMinutes: minutes }
      saveStreaks(updated)
      return updated
    })
  }, [saveStreaks])

  // Compute today's progress
  const today = getDateString()
  const todayData = streaks.studyDays?.[today] || { minutesStudied: 0, questionsAnswered: 0 }
  const dailyGoalMinutes = streaks.dailyGoalMinutes || 20
  const dailyProgress = Math.min(100, Math.round((todayData.minutesStudied / dailyGoalMinutes) * 100))

  // Check if streak is at risk (studied yesterday but not today)
  const yesterday = getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000))
  const streakAtRisk = streaks.lastActiveDate === yesterday && !streaks.studyDays?.[today]

  // Get last 30 days for heatmap
  const last30Days = []
  for (let i = 29; i >= 0; i--) {
    const date = getDateString(new Date(Date.now() - i * 24 * 60 * 60 * 1000))
    last30Days.push({
      date,
      ...((streaks.studyDays || {})[date] || { minutesStudied: 0, questionsAnswered: 0 }),
    })
  }

  return {
    streaks,
    loading,
    todayData,
    dailyGoalMinutes,
    dailyProgress,
    streakAtRisk,
    last30Days,
    recordActivity,
    setDailyGoal,
    refetch: fetchStreaks,
  }
}
