import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { FORMULA_DATA, FORMULA_SUBJECTS } from '../data/formulas'
import FormulaSheet from '../components/Reference/FormulaSheet'

export default function FormulaSheets() {
  const { isDark } = useTheme()
  const [selectedSubject, setSelectedSubject] = useState(FORMULA_SUBJECTS[0])
  const [search, setSearch] = useState('')

  const filteredCategories = useMemo(() => {
    const categories = FORMULA_DATA[selectedSubject]
    if (!categories) return {}
    if (!search.trim()) return categories

    const lower = search.toLowerCase()
    const result = {}
    for (const [cat, formulas] of Object.entries(categories)) {
      const matched = formulas.filter(
        f => f.name.toLowerCase().includes(lower) || f.formula.toLowerCase().includes(lower) || f.note.toLowerCase().includes(lower)
      )
      if (matched.length > 0) result[cat] = matched
    }
    return result
  }, [selectedSubject, search])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 pb-24"
    >
      <h1 className={`font-heading font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-navy'}`}>
        Formula Sheets
      </h1>
      <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
        Quick reference for common formulas
      </p>

      {/* Subject tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        {FORMULA_SUBJECTS.map((subject) => (
          <button
            key={subject}
            onClick={() => { setSelectedSubject(subject); setSearch('') }}
            className={`px-4 py-2 rounded-full text-sm font-heading font-medium transition-all whitespace-nowrap shrink-0 ${
              selectedSubject === subject
                ? 'bg-accent text-white'
                : isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search formulas..."
          className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all font-body ${
            isDark
              ? 'bg-navy-lighter border border-slate-600 text-white placeholder:text-slate-500 focus:border-accent'
              : 'bg-warm-gray border border-stone-300 text-navy placeholder:text-stone-400 focus:border-accent'
          }`}
        />
      </div>

      {/* Formulas */}
      {Object.keys(filteredCategories).length > 0 ? (
        <FormulaSheet subject={selectedSubject} categories={filteredCategories} />
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            No formulas match your search
          </p>
        </div>
      )}
    </motion.div>
  )
}
