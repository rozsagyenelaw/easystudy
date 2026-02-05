import { useState, useEffect, useCallback } from 'react'
import { openDB } from 'idb'

const DB_NAME = 'easystudy-offline'
const DB_VERSION = 1
const TOPIC_STORE = 'topic-packs'
const QUEUE_STORE = 'question-queue'

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TOPIC_STORE)) {
        db.createObjectStore(TOPIC_STORE, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        db.createObjectStore(QUEUE_STORE, { keyPath: 'id', autoIncrement: true })
      }
    },
  })
}

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [downloadedPacks, setDownloadedPacks] = useState([])
  const [downloading, setDownloading] = useState(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load downloaded packs list
  useEffect(() => {
    loadDownloadedPacks()
  }, [])

  const loadDownloadedPacks = async () => {
    try {
      const db = await getDB()
      const packs = await db.getAll(TOPIC_STORE)
      setDownloadedPacks(packs.map(p => ({ id: p.id, subject: p.subject, topic: p.topic, size: p.size, downloadedAt: p.downloadedAt })))
    } catch {
      setDownloadedPacks([])
    }
  }

  const downloadTopicPack = useCallback(async (packData) => {
    setDownloading(packData.id)
    try {
      const db = await getDB()
      const pack = {
        ...packData,
        downloadedAt: new Date().toISOString(),
        size: new Blob([JSON.stringify(packData)]).size,
      }
      await db.put(TOPIC_STORE, pack)
      await loadDownloadedPacks()
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(null)
    }
  }, [])

  const deleteTopicPack = useCallback(async (packId) => {
    try {
      const db = await getDB()
      await db.delete(TOPIC_STORE, packId)
      await loadDownloadedPacks()
    } catch { /* ignore */ }
  }, [])

  const getTopicPack = useCallback(async (packId) => {
    try {
      const db = await getDB()
      return await db.get(TOPIC_STORE, packId)
    } catch {
      return null
    }
  }, [])

  const queueQuestion = useCallback(async (questionData) => {
    try {
      const db = await getDB()
      await db.add(QUEUE_STORE, {
        ...questionData,
        queuedAt: new Date().toISOString(),
      })
    } catch { /* ignore */ }
  }, [])

  const getQueuedQuestions = useCallback(async () => {
    try {
      const db = await getDB()
      return await db.getAll(QUEUE_STORE)
    } catch {
      return []
    }
  }, [])

  const clearQueue = useCallback(async () => {
    try {
      const db = await getDB()
      await db.clear(QUEUE_STORE)
    } catch { /* ignore */ }
  }, [])

  // Sync queued questions when back online
  useEffect(() => {
    if (isOnline) {
      syncQueuedQuestions()
    }
  }, [isOnline])

  const syncQueuedQuestions = async () => {
    const queued = await getQueuedQuestions()
    if (queued.length === 0) return

    for (const q of queued) {
      try {
        await fetch('/.netlify/functions/solve-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q.question, subject: q.subject, depth: q.depth }),
        })
      } catch { /* will retry next time online */ }
    }
    await clearQueue()
  }

  const totalDownloadSize = downloadedPacks.reduce((sum, p) => sum + (p.size || 0), 0)

  return {
    isOnline,
    downloadedPacks,
    downloading,
    totalDownloadSize,
    downloadTopicPack,
    deleteTopicPack,
    getTopicPack,
    queueQuestion,
    getQueuedQuestions,
    clearQueue,
  }
}
