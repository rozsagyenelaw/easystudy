import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

const LOCAL_KEY = 'easystudy-history'

function getLocalHistory() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []
  } catch {
    return []
  }
}

function setLocalHistory(history) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(history))
}

export function useQuestionHistory() {
  const { user, isGuest } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    if (user) {
      try {
        const q = query(
          collection(db, 'users', user.uid, 'questions'),
          orderBy('timestamp', 'desc')
        )
        const snapshot = await getDocs(q)
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        setHistory(items)
      } catch {
        setHistory([])
      }
    } else {
      setHistory(getLocalHistory())
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const addQuestion = useCallback(async (questionData) => {
    const entry = {
      question: questionData.question,
      subject: questionData.subject,
      solution: questionData.solution,
      difficulty: questionData.solution?.difficulty || 'medium',
      bookmarked: false,
      timestamp: new Date().toISOString(),
    }

    if (user) {
      try {
        const docRef = await addDoc(
          collection(db, 'users', user.uid, 'questions'),
          { ...entry, timestamp: serverTimestamp() }
        )
        setHistory(prev => [{ id: docRef.id, ...entry }, ...prev])
        return docRef.id
      } catch {
        return null
      }
    } else {
      const id = crypto.randomUUID()
      const newEntry = { id, ...entry }
      const updated = [newEntry, ...getLocalHistory()]
      setLocalHistory(updated)
      setHistory(updated)
      return id
    }
  }, [user])

  const deleteQuestion = useCallback(async (questionId) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'questions', questionId))
      } catch { /* ignore */ }
    } else {
      const updated = getLocalHistory().filter(q => q.id !== questionId)
      setLocalHistory(updated)
    }
    setHistory(prev => prev.filter(q => q.id !== questionId))
  }, [user])

  const toggleBookmark = useCallback(async (questionId) => {
    const item = history.find(q => q.id === questionId)
    if (!item) return

    const newVal = !item.bookmarked

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid, 'questions', questionId), {
          bookmarked: newVal,
        })
      } catch { /* ignore */ }
    } else {
      const local = getLocalHistory().map(q =>
        q.id === questionId ? { ...q, bookmarked: newVal } : q
      )
      setLocalHistory(local)
    }
    setHistory(prev =>
      prev.map(q => (q.id === questionId ? { ...q, bookmarked: newVal } : q))
    )
  }, [user, history])

  return { history, loading, addQuestion, deleteQuestion, toggleBookmark, refetch: fetchHistory }
}
