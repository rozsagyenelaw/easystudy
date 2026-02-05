import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import { useOffline } from '../../hooks/useOffline'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

export default function TopicPackDownloader() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { downloadedPacks, totalDownloadSize, deleteTopicPack } = useOffline()

  if (downloadedPacks.length === 0) {
    return (
      <div className={`text-center py-6 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
        <p className="text-3xl mb-2">📥</p>
        <p className="text-sm font-heading">{t('settings.manageDownloads')}</p>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-stone-300'}`}>
          No packs downloaded yet
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className={`text-xs font-heading ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          {downloadedPacks.length} pack{downloadedPacks.length !== 1 ? 's' : ''} &middot; {formatBytes(totalDownloadSize)}
        </p>
      </div>

      {downloadedPacks.map(pack => (
        <div
          key={pack.id}
          className={`flex items-center justify-between p-3 rounded-xl ${
            isDark ? 'bg-slate-700/50' : 'bg-stone-50'
          }`}
        >
          <div>
            <p className={`text-sm font-heading font-medium ${isDark ? 'text-white' : 'text-navy'}`}>
              {pack.topic}
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              {pack.subject} &middot; {formatBytes(pack.size)}
            </p>
          </div>
          <button
            onClick={() => deleteTopicPack(pack.id)}
            className={`text-xs font-heading font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-red-500 hover:bg-red-50'
            }`}
          >
            {t('common.delete')}
          </button>
        </div>
      ))}
    </div>
  )
}
