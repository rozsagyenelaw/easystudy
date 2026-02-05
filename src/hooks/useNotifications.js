import { useState, useEffect, useCallback } from 'react'

const LOCAL_KEY = 'easystudy-notifications'
const TOAST_KEY = 'easystudy-toast'

function getLocalSettings() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || getDefaultSettings()
  } catch {
    return getDefaultSettings()
  }
}

function setLocalSettings(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

function getDefaultSettings() {
  return {
    enabled: false,
    dailyReminder: true,
    streakReminder: true,
    reviewReminder: true,
    reminderTime: '09:00',
    permissionGranted: false,
  }
}

export function useNotifications() {
  const [settings, setSettings] = useState(getDefaultSettings)
  const [permission, setPermission] = useState('default')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    setSettings(getLocalSettings())
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        const updated = { ...getLocalSettings(), enabled: true, permissionGranted: true }
        setLocalSettings(updated)
        setSettings(updated)

        // Register service worker for push if available
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready
          // Schedule daily reminder check
          scheduleReminder(registration, updated.reminderTime)
        }

        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  const updateSettings = useCallback((updates) => {
    setSettings(prev => {
      const updated = { ...prev, ...updates }
      setLocalSettings(updated)
      return updated
    })
  }, [])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToast({ id, message, type })
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev))
    }, duration)
  }, [])

  const showAchievementToast = useCallback((achievement) => {
    showToast(`${achievement.icon} ${achievement.title} earned!`, 'achievement', 4000)
  }, [showToast])

  // Schedule local notification (uses setTimeout as a simple approach for web)
  const scheduleLocalNotification = useCallback((title, body, delayMs) => {
    if (permission !== 'granted' || !settings.enabled) return

    setTimeout(() => {
      try {
        new Notification(title, {
          body,
          icon: '/icon-192.svg',
          badge: '/icon-192.svg',
          tag: 'easystudy-reminder',
        })
      } catch { /* ignore */ }
    }, delayMs)
  }, [permission, settings.enabled])

  return {
    settings,
    permission,
    toast,
    requestPermission,
    updateSettings,
    showToast,
    showAchievementToast,
    scheduleLocalNotification,
    isSupported: 'Notification' in window,
  }
}

function scheduleReminder(registration, time) {
  // For web push, we'd typically set up FCM here.
  // For now, we use a lightweight approach with local notifications
  // when the app is open. Full FCM integration would require
  // a Firebase Cloud Functions backend.
  try {
    const [hours, minutes] = time.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)

    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }

    const delay = target.getTime() - now.getTime()

    setTimeout(() => {
      try {
        new Notification('Time to study!', {
          body: "Don't forget your daily study session.",
          icon: '/icon-192.svg',
          tag: 'easystudy-daily',
        })
      } catch { /* ignore */ }
    }, delay)
  } catch { /* ignore */ }
}
