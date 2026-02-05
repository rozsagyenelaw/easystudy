import { useTranslation } from 'react-i18next'
import { useOffline } from '../../hooks/useOffline'

export default function OfflineIndicator() {
  const { t } = useTranslation()
  const { isOnline } = useOffline()

  if (isOnline) return null

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-heading font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      {t('offline.indicator')}
    </span>
  )
}
