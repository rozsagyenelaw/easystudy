import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import { useTopicContent } from '../../hooks/useTopicContent'

export default function SubjectList() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { subjects } = useTopicContent()

  return (
    <div className="space-y-3">
      {subjects.map((subject, i) => (
        <motion.div
          key={subject.subject}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            to={`/topics/${subject.subject.toLowerCase()}`}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-navy-light border-slate-700 hover:border-slate-600'
                : 'bg-white border-stone-200 hover:border-stone-300'
            }`}
          >
            <span className="text-3xl">{subject.icon}</span>
            <div className="flex-1">
              <h3 className={`font-heading font-semibold ${isDark ? 'text-white' : 'text-navy'}`}>
                {subject.subject}
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                {subject.topics.length} {subject.topics.length === 1 ? 'topic' : 'topics'}
              </p>
            </div>
            <span className={`text-lg ${isDark ? 'text-slate-600' : 'text-stone-300'}`}>→</span>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
