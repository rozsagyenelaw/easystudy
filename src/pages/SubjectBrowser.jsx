import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { useTopicContent } from '../hooks/useTopicContent'
import SubjectList from '../components/Topics/SubjectList'
import TopicList from '../components/Topics/TopicList'

export default function SubjectBrowser() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { subjectId } = useParams()
  const { subjects, getSubject, searchTopics } = useTopicContent()
  const [query, setQuery] = useState('')

  const currentSubject = subjectId ? getSubject(subjectId) : null
  const searchResults = query.length >= 2 ? searchTopics(query) : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      {/* Header */}
      <div className="mb-6">
        {currentSubject ? (
          <>
            <Link
              to="/topics"
              className={`text-sm font-heading font-medium mb-2 inline-block ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-stone-500 hover:text-navy'
              }`}
            >
              ← {t('topics.browse')}
            </Link>
            <h1 className={`font-heading font-bold text-2xl flex items-center gap-3 ${isDark ? 'text-white' : 'text-navy'}`}>
              <span className="text-3xl">{currentSubject.icon}</span>
              {currentSubject.subject}
            </h1>
          </>
        ) : (
          <>
            <h1 className={`font-heading font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-navy'}`}>
              {t('topics.browse')}
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              {t('topics.browseMsg')}
            </p>
          </>
        )}
      </div>

      {/* Search */}
      {!currentSubject && (
        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search topics..."
            className={`w-full px-4 py-3 rounded-xl border text-sm font-heading ${
              isDark
                ? 'bg-navy-light border-slate-700 text-white placeholder:text-slate-500'
                : 'bg-white border-stone-200 text-navy placeholder:text-stone-400'
            }`}
          />
        </div>
      )}

      {/* Search results */}
      {query.length >= 2 && searchResults.length > 0 && (
        <div className="mb-6 space-y-2">
          {searchResults.map((r, i) => (
            <Link
              key={i}
              to={`/topics/${r.subject.toLowerCase()}/${r.topicId}/${r.subtopicId}`}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isDark ? 'hover:bg-slate-700/50' : 'hover:bg-stone-50'
              }`}
            >
              <span>{r.subjectIcon}</span>
              <div>
                <p className={`text-sm font-heading font-medium ${isDark ? 'text-white' : 'text-navy'}`}>
                  {r.subtopicName}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                  {r.subject} → {r.topicName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Subject list or topic list */}
      {!currentSubject && query.length < 2 && <SubjectList />}
      {currentSubject && (
        <TopicList subject={currentSubject.subject} topics={currentSubject.topics} />
      )}
    </motion.div>
  )
}
