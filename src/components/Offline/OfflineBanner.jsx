import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useOffline } from '../../hooks/useOffline'

export default function OfflineBanner() {
  const { t } = useTranslation()
  const { isOnline } = useOffline()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-500 text-white text-center text-sm font-heading font-medium py-2 px-4"
        >
          {t('offline.banner')}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
