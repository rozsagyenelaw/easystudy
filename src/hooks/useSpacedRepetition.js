import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

const LOCAL_KEY = 'easystudy-spaced-rep'

function getLocalSR() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || { items: [] }
  } catch {
    return { items: [] }
  }
}

function setLocalSR(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

// Simplified SM-2 intervals
function getNextReviewDate(quality) {
  const now = new Date()
  let daysToAdd

  switch (quality) {
    case 'wrong':
      daysToAdd = 1
      break
    case 'hesitant':
      daysToAdd = 3
      break
    case 'confident':
      daysToAdd = 7
      break
    case 'easy':
      daysToAdd = 14
      break
    default:
      daysToAdd = 1
  }

  now.setDate(now.getDate() + daysToAdd)
  return now.toISOString().split('T')[0]
}

function getNextInterval(item, quality) {
  const intervals = { wrong: 1, hesitant: 3, confident: 7, easy: 14 }
  const base = intervals[quality] || 1
  const multiplier = quality === 'wrong' ? 1 : Math.min(item.consecutiveCorrect || 0, 3) + 1
  const days = Math.min(base * multiplier, 30)

  const next = new Date()
  next.setDate(next.getDate() + days)
  return next.toISOString().split('T')[0]
}

export function useSpacedRepetition() {
  const { user } = useAuth()
  const [data, setData] = useState({ items: [] })
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    if (user) {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'spacedRepetition', 'data'))
        if (snap.exists()) {
          setData(snap.data())
        } else {
          setData({ items: [] })
        }
      } catch {
        setData({ items: [] })
      }
    } else {
      setData(getLocalSR())
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const saveData = useCallback((newData) => {
    if (user) {
      setDoc(doc(db, 'users', user.uid, 'spacedRepetition', 'data'), newData, { merge: true }).catch(() => {})
    } else {
      setLocalSR(newData)
    }
  }, [user])

  const addItem = useCallback(({ subject, topic, question, type = 'topic' }) => {
    setData(prev => {
      // Don't add duplicates
      const exists = prev.items.some(i => i.subject === subject && i.topic === topic && i.question === question)
      if (exists) return prev

      const newItem = {
        id: crypto.randomUUID(),
        subject,
        topic,
        question: question || null,
        type,
        nextReviewDate: getNextReviewDate('wrong'),
        consecutiveCorrect: 0,
        totalReviews: 0,
        addedAt: new Date().toISOString(),
      }

      const updated = { items: [...prev.items, newItem] }
      saveData(updated)
      return updated
    })
  }, [saveData])

  const reviewItem = useCallback((itemId, quality) => {
    setData(prev => {
      const updated = {
        items: prev.items.map(item => {
          if (item.id !== itemId) return item

          const consecutiveCorrect = quality === 'wrong' ? 0 : (item.consecutiveCorrect || 0) + 1

          return {
            ...item,
            nextReviewDate: getNextInterval(item, quality),
            consecutiveCorrect,
            totalReviews: (item.totalReviews || 0) + 1,
            lastReviewedAt: new Date().toISOString(),
          }
        }),
      }
      saveData(updated)
      return updated
    })
  }, [saveData])

  const removeItem = useCallback((itemId) => {
    setData(prev => {
      const updated = { items: prev.items.filter(i => i.id !== itemId) }
      saveData(updated)
      return updated
    })
  }, [saveData])

  // Items due today or overdue
  const today = new Date().toISOString().split('T')[0]
  const dueItems = data.items.filter(item => item.nextReviewDate <= today)
  const upcomingItems = data.items
    .filter(item => item.nextReviewDate > today)
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))
    .slice(0, 10)

  return {
    items: data.items,
    dueItems,
    upcomingItems,
    loading,
    addItem,
    reviewItem,
    removeItem,
    refetch: fetchData,
  }
}
