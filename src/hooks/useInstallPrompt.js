import { useState, useEffect, useCallback } from 'react'

const VISIT_KEY = 'easystudy-visit-count'
const DISMISSED_KEY = 'easystudy-install-dismissed'

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Track visits
    const visits = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10) + 1
    localStorage.setItem(VISIT_KEY, String(visits))

    const dismissed = localStorage.getItem(DISMISSED_KEY) === 'true'
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show banner after 2nd visit, not dismissed, not already installed
      if (visits >= 2 && !dismissed && !isStandalone) {
        setShowBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return false
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShowBanner(false)
    return outcome === 'accepted'
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    setShowBanner(false)
    localStorage.setItem(DISMISSED_KEY, 'true')
  }, [])

  return { showBanner, install, dismiss }
}
