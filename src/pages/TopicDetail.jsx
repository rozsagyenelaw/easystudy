import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { useTopicContent } from '../hooks/useTopicContent'
import TopicPage from '../components/Topics/TopicPage'

export default function TopicDetail() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { subjectId, topicId, subtopicId } = useParams()
  const { getSubject, getSubtopic } = useTopicContent()

  const subject = getSubject(subjectId)
  const subtopic = getSubtopic(subjectId, topicId, subtopicId)

  if (!subject || !subtopic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className={`font-heading font-medium ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          Topic not found
        </p>
        <Link to="/topics" className="text-accent text-sm font-heading font-medium mt-2 inline-block">
          ← {t('topics.browse')}
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
        <Link
          to="/topics"
          className={`font-heading font-medium ${isDark ? 'text-slate-400 hover:text-white' : 'text-stone-500 hover:text-navy'}`}
        >
          {t('topics.browse')}
        </Link>
        <span className={isDark ? 'text-slate-600' : 'text-stone-300'}>→</span>
        <Link
          to={`/topics/${subjectId}`}
          className={`font-heading font-medium ${isDark ? 'text-slate-400 hover:text-white' : 'text-stone-500 hover:text-navy'}`}
        >
          {subject.subject}
        </Link>
        <span className={isDark ? 'text-slate-600' : 'text-stone-300'}>→</span>
        <span className={`font-heading font-medium ${isDark ? 'text-white' : 'text-navy'}`}>
          {subtopic.name}
        </span>
      </div>

      {/* Title */}
      <h1 className={`font-heading font-bold text-2xl mb-6 ${isDark ? 'text-white' : 'text-navy'}`}>
        {subtopic.name}
      </h1>

      <TopicPage subject={subjectId} topicId={topicId} subtopic={subtopic} />
    </motion.div>
  )
}
