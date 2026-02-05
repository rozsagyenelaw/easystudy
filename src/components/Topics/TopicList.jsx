import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

export default function TopicList({ subject, topics }) {
  const { isDark } = useTheme()

  if (!topics || topics.length === 0) return null

  return (
    <div className="space-y-3">
      {topics.map((topic, i) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-navy-light border-slate-700' : 'bg-white border-stone-200'
          }`}>
            <div className="p-4">
              <h3 className={`font-heading font-semibold mb-2 ${isDark ? 'text-white' : 'text-navy'}`}>
                {topic.name}
              </h3>
              <div className="space-y-1">
                {topic.subtopics.map(subtopic => (
                  <Link
                    key={subtopic.id}
                    to={`/topics/${subject.toLowerCase()}/${topic.id}/${subtopic.id}`}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      isDark
                        ? 'hover:bg-slate-700/50 text-slate-300'
                        : 'hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <span className="text-sm font-heading font-medium">{subtopic.name}</span>
                    <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-stone-300'}`}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
