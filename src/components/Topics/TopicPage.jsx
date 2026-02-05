import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import { useOffline } from '../../hooks/useOffline'
import TheorySummary from './TheorySummary'
import ExampleQuestion from './ExampleQuestion'

export default function TopicPage({ subject, topicId, subtopic }) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { downloadTopicPack, downloadedPacks, downloading } = useOffline()
  const [tab, setTab] = useState('theory')

  if (!subtopic) return null

  const isDownloaded = downloadedPacks.some(p => p.id === `${subject}-${topicId}-${subtopic.id}`)
  const isDownloading = downloading === `${subject}-${topicId}-${subtopic.id}`

  const handleDownload = () => {
    downloadTopicPack({
      id: `${subject}-${topicId}-${subtopic.id}`,
      subject,
      topic: subtopic.name,
      theory: subtopic.theory,
      examples: subtopic.examples,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-xl mb-6 ${isDark ? 'bg-navy-lighter' : 'bg-stone-100'}`}>
        {['theory', 'examples'].map(t2 => (
          <button
            key={t2}
            onClick={() => setTab(t2)}
            className={`flex-1 py-2 rounded-lg text-sm font-heading font-medium transition-all ${
              tab === t2
                ? 'bg-accent text-white'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t(`topics.${t2}`)}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'theory' && <TheorySummary theory={subtopic.theory} />}
      {tab === 'examples' && (
        <div className="space-y-4">
          {subtopic.examples?.map((ex, i) => (
            <ExampleQuestion key={i} example={ex} index={i} />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 space-y-3">
        <Link
          to={`/practice?subject=${subject}&topic=${subtopic.name}`}
          className="btn-primary w-full text-center block py-3"
        >
          {t('topics.practiceThis')}
        </Link>

        <button
          onClick={handleDownload}
          disabled={isDownloaded || isDownloading}
          className={`w-full py-3 rounded-xl text-sm font-heading font-medium transition-colors ${
            isDownloaded
              ? isDark ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              : isDark
              ? 'bg-navy-lighter text-slate-300 hover:text-white'
              : 'bg-stone-100 text-stone-600 hover:text-navy'
          }`}
        >
          {isDownloading ? t('topics.downloading') : isDownloaded ? t('topics.downloaded') : t('topics.download')}
        </button>
      </div>

      {/* Related topics */}
      {subtopic.relatedTopics?.length > 0 && (
        <div className="mt-8">
          <h3 className={`font-heading font-semibold text-sm mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
            {t('topics.relatedTopics')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {subtopic.relatedTopics.map(rt => (
              <span
                key={rt}
                className={`px-3 py-1.5 rounded-full text-xs font-heading ${
                  isDark ? 'bg-slate-700 text-slate-300' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {rt}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
