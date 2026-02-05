import { useState, useEffect, useCallback, useRef } from 'react'
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

const LOCAL_KEY = 'easystudy-achievements'

const ACHIEVEMENT_DEFS = [
  { id: 'first_question', title: 'First Question', desc: 'Solved your first question', icon: '🎉', check: (s) => s.totalQuestions >= 1 },
  { id: 'streak_3', title: 'Streak Starter', desc: '3-day study streak', icon: '🔥', check: (s) => s.currentStreak >= 3 },
  { id: 'streak_7', title: 'Week Warrior', desc: '7-day study streak', icon: '⚡', check: (s) => s.currentStreak >= 7 },
  { id: 'streak_30', title: 'Monthly Master', desc: '30-day study streak', icon: '🏆', check: (s) => s.currentStreak >= 30 },
  { id: 'questions_10', title: 'Getting Started', desc: '10 questions solved', icon: '📝', check: (s) => s.totalQuestions >= 10 },
  { id: 'questions_50', title: 'Half Century', desc: '50 questions solved', icon: '📚', check: (s) => s.totalQuestions >= 50 },
  { id: 'questions_100', title: 'Century', desc: '100 questions solved', icon: '💯', check: (s) => s.totalQuestions >= 100 },
  { id: 'practice_10', title: 'Practice Pro', desc: '10 practice sessions completed', icon: '🎯', check: (s) => s.practiceSessions >= 10 },
  { id: 'subject_expert', title: 'Subject Expert', desc: 'Mastered all topics in a subject', icon: '🧠', check: (s) => s.hasSubjectExpert },
  { id: 'night_owl', title: 'Night Owl', desc: 'Studied after 10pm', icon: '🦉', check: (s) => s.isNightOwl },
  { id: 'early_bird', title: 'Early Bird', desc: 'Studied before 7am', icon: '🐦', check: (s) => s.isEarlyBird },
  { id: 'multi_subject', title: 'Renaissance Student', desc: 'Studied 3+ subjects', icon: '🌟', check: (s) => s.subjectsStudied >= 3 },
]

function getLocalAchievements() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []
  } catch {
    return []
  }
}

function setLocalAchievements(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

export function useAchievements() {
  const { user } = useAuth()
  const [earned, setEarned] = useState([])
  const [loading, setLoading] = useState(true)
  const [newAchievement, setNewAchievement] = useState(null)
  const prevEarnedRef = useRef(new Set())

  const fetchAchievements = useCallback(async () => {
    setLoading(true)
    if (user) {
      try {
        const snap = await getDocs(collection(db, 'users', user.uid, 'achievements'))
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setEarned(items)
        prevEarnedRef.current = new Set(items.map(a => a.id))
      } catch {
        setEarned([])
      }
    } else {
      const local = getLocalAchievements()
      setEarned(local)
      prevEarnedRef.current = new Set(local.map(a => a.id))
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  const checkAchievements = useCallback((statsSnapshot) => {
    const hour = new Date().getHours()
    const enriched = {
      ...statsSnapshot,
      isNightOwl: hour >= 22 || hour < 4,
      isEarlyBird: hour >= 4 && hour < 7,
    }

    const newlyEarned = []

    for (const def of ACHIEVEMENT_DEFS) {
      if (prevEarnedRef.current.has(def.id)) continue
      if (!def.check(enriched)) continue

      const achievement = {
        id: def.id,
        title: def.title,
        desc: def.desc,
        icon: def.icon,
        earnedAt: new Date().toISOString(),
      }

      newlyEarned.push(achievement)

      if (user) {
        setDoc(doc(db, 'users', user.uid, 'achievements', def.id), achievement).catch(() => {})
      }
    }

    if (newlyEarned.length > 0) {
      setEarned(prev => {
        const updated = [...prev, ...newlyEarned]
        if (!user) setLocalAchievements(updated)
        return updated
      })

      newlyEarned.forEach(a => prevEarnedRef.current.add(a.id))
      // Show the first new achievement as a toast
      setNewAchievement(newlyEarned[0])
      setTimeout(() => setNewAchievement(null), 4000)
    }

    return newlyEarned
  }, [user])

  const dismissNewAchievement = useCallback(() => {
    setNewAchievement(null)
  }, [])

  return {
    earned,
    loading,
    newAchievement,
    allAchievements: ACHIEVEMENT_DEFS,
    checkAchievements,
    dismissNewAchievement,
    refetch: fetchAchievements,
  }
}
