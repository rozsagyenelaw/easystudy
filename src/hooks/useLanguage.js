import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

export function useLanguage() {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language?.split('-')[0] || 'en'

  const setLanguage = useCallback((code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('easystudy-language', code)
  }, [i18n])

  const currentLabel = LANGUAGES.find(l => l.code === currentLanguage)?.label || 'English'

  return {
    currentLanguage,
    currentLabel,
    languages: LANGUAGES,
    setLanguage,
  }
}
