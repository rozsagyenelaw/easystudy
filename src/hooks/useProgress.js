import { useState, useEffect, useCallback } from 'react'
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

const LOCAL_KEY = 'easystudy-progress'

function getLocalProgress() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}
  } catch {
    return {}
  }
}

function setLocalProgress(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

function computeMasteryLevel(topic) {
  if (!topic || topic.questionsAttempted < 2) return 'beginner'
  const accuracy = topic.questionsCorrect / topic.questionsAttempted
  const recencyBonus = topic.lastPracticed
    ? Math.max(0, 1 - (Date.now() - new Date(topic.lastPracticed).getTime()) / (30 * 24 * 60 * 60 * 1000))
    : 0
  const score = accuracy * 0.7 + recencyBonus * 0.3
  if (score >= 0.8) return 'mastered'
  if (score >= 0.5) return 'confident'
  if (score >= 0.25) return 'improving'
  return 'beginner'
}

function computeMasteryPercent(level) {
  const map = { beginner: 10, improving: 37, confident: 65, mastered: 90 }
  return map[level] || 10
}

export function useProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchProgress = useCallback(async () => {
    setLoading(true)
    if (user) {
      try {
        const snap = await getDocs(collection(db, 'users', user.uid, 'progress'))
        const data = {}
        snap.forEach(d => { data[d.id] = d.data() })
        setProgress(data)
      } catch {
        setProgress({})
      }
    } else {
      setProgress(getLocalProgress())
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  const recordQuestion = useCallback(async (subject, topic, correct, difficulty) => {
    const now = new Date().toISOString()

    setProgress(prev => {
      const subjectData = prev[subject] || { topics: {}, totalQuestions: 0, totalCorrect: 0, averageAccuracy: 0 }
      const topicData = subjectData.topics[topic] || {
        questionsAttempted: 0,
        questionsCorrect: 0,
        lastPracticed: now,
        masteryLevel: 'beginner',
        nextReviewDate: null,
      }

      topicData.questionsAttempted++
      if (correct) topicData.questionsCorrect++
      topicData.lastPracticed = now
      topicData.masteryLevel = computeMasteryLevel(topicData)

      subjectData.topics[topic] = topicData
      subjectData.totalQuestions = Object.values(subjectData.topics).reduce((s, t) => s + t.questionsAttempted, 0)
      subjectData.totalCorrect = Object.values(subjectData.topics).reduce((s, t) => s + t.questionsCorrect, 0)
      subjectData.averageAccuracy = subjectData.totalQuestions > 0
        ? Math.round((subjectData.totalCorrect / subjectData.totalQuestions) * 100)
        : 0

      const updated = { ...prev, [subject]: subjectData }

      if (user) {
        setDoc(doc(db, 'users', user.uid, 'progress', subject), subjectData, { merge: true }).catch(() => {})
      } else {
        setLocalProgress(updated)
      }

      return updated
    })
  }, [user])

  // Aggregate stats
  const stats = {
    totalQuestions: Object.values(progress).reduce((s, sub) => s + (sub.totalQuestions || 0), 0),
    totalCorrect: Object.values(progress).reduce((s, sub) => s + (sub.totalCorrect || 0), 0),
    subjectsStudied: Object.keys(progress).length,
    averageAccuracy: 0,
  }
  if (stats.totalQuestions > 0) {
    stats.averageAccuracy = Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
  }

  // Weakest topics
  const allTopics = []
  Object.entries(progress).forEach(([subject, data]) => {
    Object.entries(data.topics || {}).forEach(([topicName, topicData]) => {
      allTopics.push({
        subject,
        topic: topicName,
        ...topicData,
        masteryPercent: computeMasteryPercent(topicData.masteryLevel),
      })
    })
  })
  const weakestTopics = [...allTopics]
    .sort((a, b) => a.masteryPercent - b.masteryPercent)
    .slice(0, 5)

  return {
    progress,
    loading,
    stats,
    allTopics,
    weakestTopics,
    recordQuestion,
    refetch: fetchProgress,
    computeMasteryLevel,
    computeMasteryPercent,
  }
}
